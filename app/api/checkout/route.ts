import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createPreference, isMercadoPagoConfigured } from "@/lib/mercadopago"
import { getSiteUrl } from "@/lib/site-url"

/**
 * POST /api/checkout
 *
 * Fluxo:
 *
 * TURMA PAGA:
 * 1. Valida os dados
 * 2. Verifica turma e vagas
 * 3. Cria inscrição com status "pending"
 * 4. Cria preferência no Mercado Pago
 * 5. Retorna URL do Checkout Pro
 *
 * TURMA GRATUITA:
 * 1. Valida os dados
 * 2. Verifica turma e vagas
 * 3. Cria inscrição com status "confirmed"
 * 4. Não chama o Mercado Pago
 * 5. Retorna sucesso para o frontend
 *
 * Body:
 * {
 *   editionId,
 *   buyerName,
 *   buyerEmail,
 *   buyerPhone?,
 *   quantity?
 * }
 */

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      editionId,
      buyerName,
      buyerEmail,
      buyerPhone,
      quantity = 1,
    } = body ?? {}

    // ============================================================
    // 1. VALIDAÇÃO DOS DADOS
    // ============================================================

    if (!editionId || !buyerName || !buyerEmail) {
      return NextResponse.json(
        {
          error: "Preencha nome, e-mail e selecione a turma.",
        },
        { status: 400 },
      )
    }

    const qty = Math.max(
      1,
      Math.min(10, Number(quantity) || 1),
    )

    // ============================================================
    // 2. CONEXÃO COM O SUPABASE
    // ============================================================

    const admin = createAdminClient()

    // ============================================================
    // 3. BUSCA A TURMA E O EVENTO
    // ============================================================

    const { data: edition, error: edErr } = await admin
      .from("editions")
      .select("*, events(title)")
      .eq("id", editionId)
      .maybeSingle()

    if (edErr) {
      console.error(
        "[CHECKOUT] Erro ao buscar turma no Supabase:",
        edErr,
      )

      return NextResponse.json(
        {
          error: "Erro ao buscar os dados da turma.",
          details: edErr.message,
        },
        { status: 500 },
      )
    }

    if (!edition) {
      return NextResponse.json(
        {
          error: "Turma não encontrada.",
        },
        { status: 404 },
      )
    }

    // ============================================================
    // 4. VERIFICA SE AS INSCRIÇÕES ESTÃO ABERTAS
    // ============================================================

    const openStatuses = [
      "inscricoes_abertas",
      "ultimas_vagas",
    ]

    if (!openStatuses.includes(edition.status)) {
      return NextResponse.json(
        {
          error:
            "As inscrições para esta turma não estão abertas.",
        },
        { status: 409 },
      )
    }

    // ============================================================
    // 5. VERIFICA AS VAGAS
    // ============================================================

    const seatsLeft =
      edition.capacity - edition.seats_taken

    if (seatsLeft < qty) {
      return NextResponse.json(
        {
          error:
            "Não há vagas suficientes nesta turma.",
        },
        { status: 409 },
      )
    }

    // ============================================================
    // 6. CALCULA O VALOR
    // ============================================================

    const amountCents =
      edition.price_cents * qty

    const isFree =
      amountCents <= 0

    const eventTitle =
      (edition.events as { title?: string } | null)
        ?.title ?? "Vivência"

    const itemTitle = edition.title
      ? `${eventTitle} — ${edition.title}`
      : eventTitle

    console.log(
      "[CHECKOUT] Dados da inscrição:",
      {
        editionId,
        buyerName,
        buyerEmail,
        quantity: qty,
        amountCents,
        isFree,
      },
    )

    // ============================================================
    // 7. CRIA A INSCRIÇÃO
    //
    // GRATUITA:
    // status = confirmed
    // payment_provider = null
    //
    // PAGA:
    // status = pending
    // payment_provider = mercadopago
    // ============================================================

    const {
      data: registration,
      error: regErr,
    } = await admin
      .from("registrations")
      .insert({
        edition_id: editionId,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone ?? null,
        quantity: qty,
        amount_cents: amountCents,
        currency: edition.currency ?? "BRL",

        // Oficina gratuita já está confirmada.
        // Oficina paga aguarda pagamento.
        status: isFree ? "confirmed" : "pending",

        // Oficina gratuita não utiliza gateway.
        payment_provider: isFree
          ? null
          : "mercadopago",
      })
      .select("id")
      .single()

    if (regErr || !registration) {
      console.error(
        "[CHECKOUT] Erro ao criar inscrição:",
        regErr,
      )

      return NextResponse.json(
        {
          error:
            "Não foi possível iniciar a inscrição.",
          details: regErr?.message,
        },
        { status: 500 },
      )
    }

    console.log(
      "[CHECKOUT] Inscrição criada:",
      {
        registrationId: registration.id,
        status: isFree ? "confirmed" : "pending",
      },
    )

    // ============================================================
    // 8. FLUXO DE OFICINA GRATUITA
    //
    // NÃO passa pelo Mercado Pago.
    // A inscrição já está confirmada.
    // ============================================================

    if (isFree) {
      console.log(
        "[CHECKOUT] Inscrição gratuita confirmada:",
        registration.id,
      )

      return NextResponse.json({
        success: true,
        free: true,
        confirmed: true,
        registrationId: registration.id,
        message:
          "Inscrição realizada com sucesso!",
      })
    }

    // ============================================================
    // 9. FLUXO DE OFICINA PAGA
    //
    // A partir daqui, continua exatamente o fluxo
    // do Checkout Pro do Mercado Pago.
    // ============================================================

    if (!isMercadoPagoConfigured()) {
      console.error(
        "[CHECKOUT] MERCADOPAGO_ACCESS_TOKEN não configurado.",
      )

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

    // ============================================================
    // 10. OBTÉM A URL PRINCIPAL DO SITE
    // ============================================================

    const siteUrl = getSiteUrl()

    console.log(
      "[CHECKOUT] Site URL utilizada:",
      siteUrl,
    )

    // ============================================================
    // 11. CRIA A PREFERÊNCIA NO MERCADO PAGO
    // ============================================================

    const {
      preferenceId,
      initPoint,
    } = await createPreference({
      registrationId: registration.id,
      title: itemTitle,
      quantity: qty,
      unitPriceCents: edition.price_cents,
      buyerEmail,

      successUrl:
        `${siteUrl}/checkout/sucesso?reg=${registration.id}`,

      failureUrl:
        `${siteUrl}/checkout/erro?reg=${registration.id}`,

      pendingUrl:
        `${siteUrl}/checkout/pendente?reg=${registration.id}`,

      notificationUrl:
        `${siteUrl}/api/webhooks/mercadopago`,
    })

    console.log(
      "[CHECKOUT] Preferência criada com sucesso:",
      {
        preferenceId,
        hasInitPoint: Boolean(initPoint),
      },
    )

    // ============================================================
    // 12. SALVA O ID DA PREFERÊNCIA NO SUPABASE
    // ============================================================

    const {
      error: updateErr,
    } = await admin
      .from("registrations")
      .update({
        provider_preference_id: preferenceId,
      })
      .eq("id", registration.id)

    if (updateErr) {
      console.error(
        "[CHECKOUT] Erro ao salvar preference_id:",
        updateErr,
      )

      // Não interrompe o checkout.
      // A preferência já foi criada no Mercado Pago.
    }

    // ============================================================
    // 13. RETORNA A URL DO MERCADO PAGO
    // ============================================================

    return NextResponse.json({
      success: true,
      free: false,
      confirmed: false,
      url: initPoint,
      registrationId: registration.id,
    })

  } catch (err) {
    // ============================================================
    // DEBUG
    // ============================================================

    const message =
      err instanceof Error
        ? err.message
        : String(err)

    console.error(
      "[CHECKOUT ERROR] Erro completo:",
      err,
    )

    console.error(
      "[CHECKOUT ERROR] Mensagem:",
      message,
    )

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    )
  }
}