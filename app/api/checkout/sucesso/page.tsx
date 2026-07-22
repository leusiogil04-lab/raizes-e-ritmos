"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react"

import { track } from "@/lib/analytics"

interface RegistrationData {
  registrationId: string
  status: string
  quantity: number
  amountCents: number
  currency: string
  editionId: string
}

export default function CheckoutSuccessPage() {
  const [loading, setLoading] =
    useState(true)

  const [registration, setRegistration] =
    useState<RegistrationData | null>(
      null,
    )

  const [error, setError] =
    useState<string | null>(
      null,
    )

  useEffect(() => {
    async function verifyPayment() {
      try {
        /**
         * ============================================================
         * 1. PEGA O ID DA INSCRIÇÃO NA URL
         * ============================================================
         *
         * Exemplo:
         *
         * /checkout/sucesso?reg=123
         */
        const params =
          new URLSearchParams(
            window.location.search,
          )

        const registrationId =
          params.get("reg")

        if (!registrationId) {
          setError(
            "Não foi possível identificar sua inscrição.",
          )

          setLoading(false)

          return
        }

        /**
         * ============================================================
         * 2. PROTEÇÃO CONTRA DUPLICIDADE
         * ============================================================
         *
         * Criamos uma chave única para esta compra.
         *
         * Exemplo:
         *
         * purchase_tracked_123
         */
        const purchaseKey =
          `purchase_tracked_${registrationId}`

        /**
         * Verifica se o Purchase já foi disparado
         * anteriormente neste navegador.
         */
        const alreadyTracked =
          sessionStorage.getItem(
            purchaseKey,
          )

        /**
         * ============================================================
         * 3. CONSULTA O STATUS REAL NO SERVIDOR
         * ============================================================
         */
        const response =
          await fetch(
            `/api/checkout/status?reg=${encodeURIComponent(
              registrationId,
            )}`,
            {
              method: "GET",

              cache: "no-store",
            },
          )

        const data =
          await response.json()

        if (
          !response.ok
        ) {
          throw new Error(
            data.error ??
              "Não foi possível verificar o pagamento.",
          )
        }

        setRegistration(data)

        /**
         * ============================================================
         * 4. VERIFICA SE O PAGAMENTO FOI APROVADO
         * ============================================================
         *
         * O Purchase só é disparado quando:
         *
         * status === "paid"
         */
        if (
          data.status === "paid"
        ) {
          /**
           * ========================================================
           * 5. EVITA DUPLICAR O PURCHASE
           * ========================================================
           */
          if (
            !alreadyTracked
          ) {
            /**
             * Converte centavos para reais.
             *
             * Exemplo:
             *
             * 4000 centavos
             * =
             * R$ 40,00
             */
            const value =
              Number(
                data.amountCents,
              ) / 100

            /**
             * ======================================================
             * 6. DISPARA PURCHASE
             * ======================================================
             */
            track(
              "purchase",
              {
                registrationId:
                  data.registrationId,

                editionId:
                  data.editionId,

                value,

                currency:
                  data.currency ??
                  "BRL",

                quantity:
                  data.quantity,
              },
            )

            /**
             * ======================================================
             * 7. MARCA COMO JÁ ENVIADO
             * ======================================================
             *
             * O sessionStorage impede que o evento seja
             * disparado novamente enquanto o usuário estiver
             * nesta sessão do navegador.
             */
            sessionStorage.setItem(
              purchaseKey,
              "true",
            )
          }
        }

        setLoading(false)
      } catch (err) {
        console.error(
          "[CHECKOUT SUCCESS] Erro:",
          err,
        )

        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível verificar o pagamento.",
        )

        setLoading(false)
      }
    }

    verifyPayment()
  }, [])

  /**
   * ================================================================
   * CARREGANDO
   * ================================================================
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="flex flex-col items-center text-center">

          <Loader2 className="mb-4 size-10 animate-spin text-terracotta" />

          <h1 className="font-serif text-2xl font-semibold text-wine">
            Confirmando seu pagamento...
          </h1>

          <p className="mt-2 text-sm text-wine/70">
            Estamos verificando sua inscrição.
          </p>

        </div>
      </main>
    )
  }

  /**
   * ================================================================
   * ERRO
   * ================================================================
   */
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6">

        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">

          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-terracotta/10">
            <AlertCircle className="size-9 text-terracotta" />
          </div>

          <h1 className="font-serif text-2xl font-semibold text-wine">
            Não foi possível confirmar
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-wine/70">
            {error}
          </p>

        </div>

      </main>
    )
  }

  /**
   * ================================================================
   * PAGAMENTO APROVADO
   * ================================================================
   */
  if (
    registration?.status ===
    "paid"
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6">

        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">

          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-terracotta/10">
            <CheckCircle2 className="size-9 text-terracotta" />
          </div>

          <h1 className="font-serif text-3xl font-semibold text-wine">
            Pagamento confirmado!
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-wine/70">
            Sua inscrição foi confirmada com sucesso.
            <br />
            Em breve você receberá mais informações
            pelo e-mail ou WhatsApp informado.
          </p>

          <a
            href="/"
            className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-wine"
          >
            Voltar ao site
          </a>

        </div>

      </main>
    )
  }

  /**
   * ================================================================
   * PAGAMENTO AINDA PENDENTE
   * ================================================================
   */
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">

        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-wine/10">
          <Loader2 className="size-9 text-wine" />
        </div>

        <h1 className="font-serif text-3xl font-semibold text-wine">
          Pagamento em processamento
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-wine/70">
          Seu pagamento ainda está sendo processado.
          <br />
          Assim que for confirmado, sua inscrição será atualizada.
        </p>

        <a
          href="/"
          className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-wine"
        >
          Voltar ao site
        </a>

      </div>

    </main>
  )
}