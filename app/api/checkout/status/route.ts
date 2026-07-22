import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(
  request: Request,
) {
  try {
    const url =
      new URL(request.url)

    const registrationId =
      url.searchParams.get(
        "reg",
      )

    if (!registrationId) {
      return NextResponse.json(
        {
          error:
            "ID da inscrição não informado.",
        },
        {
          status: 400,
        },
      )
    }

    const admin =
      createAdminClient()

    const {
      data: registration,
      error,
    } = await admin
      .from("registrations")
      .select(
        `
          id,
          status,
          quantity,
          amount_cents,
          currency,
          edition_id
        `,
      )
      .eq(
        "id",
        registrationId,
      )
      .maybeSingle()

    if (error) {
      console.error(
        "[CHECKOUT STATUS] Erro:",
        error,
      )

      return NextResponse.json(
        {
          error:
            "Não foi possível consultar a inscrição.",
        },
        {
          status: 500,
        },
      )
    }

    if (!registration) {
      return NextResponse.json(
        {
          error:
            "Inscrição não encontrada.",
        },
        {
          status: 404,
        },
      )
    }

    return NextResponse.json({
      success: true,

      registrationId:
        registration.id,

      status:
        registration.status,

      quantity:
        registration.quantity,

      amountCents:
        registration.amount_cents,

      currency:
        registration.currency,

      editionId:
        registration.edition_id,
    })
  } catch (error) {
    console.error(
      "[CHECKOUT STATUS] Erro inesperado:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Erro interno ao consultar o pagamento.",
      },
      {
        status: 500,
      },
    )
  }
}