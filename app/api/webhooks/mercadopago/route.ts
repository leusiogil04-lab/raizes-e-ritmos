import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getPayment } from "@/lib/mercadopago"

/**
 * POST /api/webhooks/mercadopago
 * Recebe notificações do Mercado Pago, consulta o pagamento e
 * atualiza a inscrição correspondente. Confirma vagas quando aprovado.
 *
 * Configure esta URL no painel do Mercado Pago:
 *   {seu-dominio}/api/webhooks/mercadopago
 */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    let paymentId =
      url.searchParams.get("data.id") || url.searchParams.get("id") || null

    // O corpo também pode conter o id (formato varia por evento)
    const body = await request.json().catch(() => null)
    const type = body?.type || url.searchParams.get("type")
    if (!paymentId && body?.data?.id) paymentId = String(body.data.id)

    // Só tratamos notificações de pagamento
    if (type && type !== "payment") {
      return NextResponse.json({ ok: true, ignored: type })
    }
    if (!paymentId) {
      return NextResponse.json({ ok: true, note: "sem payment id" })
    }

    // Consulta o pagamento no Mercado Pago
    const payment = await getPayment(paymentId)
    const registrationId = payment.external_reference
    const mpStatus = payment.status // approved | pending | rejected | ...

    if (!registrationId) {
      return NextResponse.json({ ok: true, note: "sem external_reference" })
    }

    const statusMap: Record<string, string> = {
      approved: "paid",
      authorized: "paid",
      pending: "pending",
      in_process: "pending",
      rejected: "failed",
      cancelled: "cancelled",
      refunded: "refunded",
      charged_back: "refunded",
    }
    const newStatus = statusMap[mpStatus ?? "pending"] ?? "pending"

    const admin = createAdminClient()

    // Estado atual (evita processar vagas duas vezes)
    const { data: current } = await admin
      .from("registrations")
      .select("id, status, quantity, edition_id")
      .eq("id", registrationId)
      .maybeSingle()

    if (!current) {
      return NextResponse.json({ ok: true, note: "inscrição não encontrada" })
    }

    const wasPaid = current.status === "paid"

    await admin
      .from("registrations")
      .update({
        status: newStatus,
        provider_payment_id: String(paymentId),
        updated_at: new Date().toISOString(),
      })
      .eq("id", registrationId)

    // Ao confirmar o pagamento pela primeira vez, ocupa as vagas
    if (newStatus === "paid" && !wasPaid) {
      const { data: ed } = await admin
        .from("editions")
        .select("seats_taken, capacity")
        .eq("id", current.edition_id)
        .maybeSingle()

      if (ed) {
        const nextSeats = Math.min(ed.capacity, ed.seats_taken + current.quantity)
        await admin
          .from("editions")
          .update({ seats_taken: nextSeats })
          .eq("id", current.edition_id)
      }
    }

    return NextResponse.json({ ok: true, status: newStatus })
  } catch (err) {
    console.log("[v0] webhook error:", err instanceof Error ? err.message : String(err))
    // Retorna 200 para evitar reenvios infinitos em erros não recuperáveis
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
