import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createPreference, isMercadoPagoConfigured } from "@/lib/mercadopago"
import { getSiteUrl } from "@/lib/site-url"

/**
 * POST /api/checkout
 * Cria uma inscrição pendente e (se o Mercado Pago estiver configurado)
 * uma preferência de pagamento, retornando a URL de checkout.
 *
 * Body: { editionId, buyerName, buyerEmail, buyerPhone?, quantity? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { editionId, buyerName, buyerEmail, buyerPhone, quantity = 1 } = body ?? {}

    // Validação de entrada
    if (!editionId || !buyerName || !buyerEmail) {
      return NextResponse.json(
        { error: "Preencha nome, e-mail e selecione a turma." },
        { status: 400 },
      )
    }
    const qty = Math.max(1, Math.min(10, Number(quantity) || 1))

    const admin = createAdminClient()

    // Busca a turma + evento (fonte de verdade do preço e vagas)
    const { data: edition, error: edErr } = await admin
      .from("editions")
      .select("*, events(title)")
      .eq("id", editionId)
      .maybeSingle()

    if (edErr || !edition) {
      return NextResponse.json({ error: "Turma não encontrada." }, { status: 404 })
    }

    // Regras de negócio
    const openStatuses = ["inscricoes_abertas", "ultimas_vagas"]
    if (!openStatuses.includes(edition.status)) {
      return NextResponse.json(
        { error: "As inscrições para esta turma não estão abertas." },
        { status: 409 },
      )
    }
    const seatsLeft = edition.capacity - edition.seats_taken
    if (seatsLeft < qty) {
      return NextResponse.json(
        { error: "Não há vagas suficientes nesta turma." },
        { status: 409 },
      )
    }

    const amountCents = edition.price_cents * qty
    const eventTitle = (edition.events as { title?: string } | null)?.title ?? "Vivência"
    const itemTitle = edition.title ? `${eventTitle} — ${edition.title}` : eventTitle

    // Cria a inscrição pendente
    const { data: registration, error: regErr } = await admin
      .from("registrations")
      .insert({
        edition_id: editionId,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone ?? null,
        quantity: qty,
        amount_cents: amountCents,
        currency: edition.currency ?? "BRL",
        status: "pending",
        payment_provider: "mercadopago",
      })
      .select("id")
      .single()

    if (regErr || !registration) {
      console.log("[v0] erro ao criar inscrição:", regErr?.message)
      return NextResponse.json(
        { error: "Não foi possível iniciar a inscrição." },
        { status: 500 },
      )
    }

    // Se o Mercado Pago não estiver configurado, retorna aviso claro
    if (!isMercadoPagoConfigured()) {
      return NextResponse.json(
        {
          error:
            "O pagamento online ainda não foi ativado. Defina MERCADOPAGO_ACCESS_TOKEN nas variáveis do projeto.",
          registrationId: registration.id,
          configured: false,
        },
        { status: 503 },
      )
    }

    // Cria a preferência de pagamento
    const siteUrl = getSiteUrl()
    const { preferenceId, initPoint } = await createPreference({
      registrationId: registration.id,
      title: itemTitle,
      quantity: qty,
      unitPriceCents: edition.price_cents,
      buyerEmail,
      successUrl: `${siteUrl}/checkout/sucesso?reg=${registration.id}`,
      failureUrl: `${siteUrl}/checkout/erro?reg=${registration.id}`,
      pendingUrl: `${siteUrl}/checkout/pendente?reg=${registration.id}`,
      notificationUrl: `${siteUrl}/api/webhooks/mercadopago`,
    })

    // Salva o preference_id na inscrição
    await admin
      .from("registrations")
      .update({ provider_preference_id: preferenceId })
      .eq("id", registration.id)

    return NextResponse.json({ url: initPoint, registrationId: registration.id })
  } catch (err) {
    console.log("[v0] checkout error:", err instanceof Error ? err.message : String(err))
    return NextResponse.json(
      { error: "Erro inesperado ao processar o checkout." },
      { status: 500 },
    )
  }
}
