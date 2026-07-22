import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createPreference, isMercadoPagoConfigured } from "@/lib/mercadopago"
import { getSiteUrl } from "@/lib/site-url"

/**
 * POST /api/checkout
 * Cria uma inscrição pendente e uma preferência de pagamento no Mercado Pago.
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
    // 1. VALIDAÇÃO DOS DADOS RECEBIDOS
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

    const eventTitle =
      (edition.events as { title?: string } | null)
        ?.title ?? "Vivência"

    const itemTitle = edition.title
      ? `${eventTitle} — ${edition.title}`
      : eventTitle

    // ============================================================
    // 7. CRIA A INSCRIÇÃO PENDENTE NO SUPABASE
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
        status: "pending",
        payment_provider: "mercadopago",
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

    // ============================================================
    // 8. VERIFICA SE O MERCADO PAGO ESTÁ CONFIGURADO
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
    // 9. OBTÉM A URL PRINCIPAL DO SITE
    // ============================================================

    const siteUrl = getSiteUrl()

    console.log(
      "[CHECKOUT] Site URL utilizada:",
      siteUrl,
    )

    console.log(
      "[CHECKOUT] Criando preferência para:",
      {
        registrationId: registration.id,
        title: itemTitle,
        quantity: qty,
        unitPriceCents: edition.price_cents,
        buyerEmail,
      },
    )

    // ============================================================
    // 10. CRIA A PREFERÊNCIA NO MERCADO PAGO
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
    // 11. SALVA O ID DA PREFERÊNCIA NO SUPABASE
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

      // Não interrompe o checkout, pois a preferência
      // já foi criada no Mercado Pago.
    }

    // ============================================================
    // 12. RETORNA A URL PARA O FRONTEND
    // ============================================================

    return NextResponse.json({
      url: initPoint,
      registrationId: registration.id,
    })
  } catch (err) {
    // ============================================================
    // DEBUG TEMPORÁRIO
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