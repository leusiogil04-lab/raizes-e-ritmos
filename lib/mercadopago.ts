import { MercadoPagoConfig, Preference, Payment } from "mercadopago"

/**
 * =====================================================================
 *  MERCADO PAGO — INTEGRAÇÃO DE PAGAMENTO (Checkout Pro)
 * =====================================================================
 *
 *  CREDENCIAIS NECESSÁRIAS (adicione nas variáveis de ambiente do projeto):
 *   - MERCADOPAGO_ACCESS_TOKEN ... Access Token (produção ou teste)
 *
 *  Onde obter: https://www.mercadopago.com.br/developers/panel/app
 *  -> Sua aplicação -> Credenciais -> Access Token
 *
 *  Enquanto o token não estiver configurado, `isMercadoPagoConfigured()`
 *  retorna false e o site usa o fluxo alternativo (WhatsApp).
 * =====================================================================
 */

export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN)
}

function getClient(): MercadoPagoConfig {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado.")
  }
  return new MercadoPagoConfig({ accessToken })
}

export interface CreatePreferenceInput {
  registrationId: string
  title: string
  quantity: number
  unitPriceCents: number
  buyerEmail: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
  notificationUrl: string
}

/**
 * Cria uma preferência de pagamento (Checkout Pro) e retorna a URL
 * (`init_point`) para redirecionar o comprador ao Mercado Pago.
 */
export async function createPreference(input: CreatePreferenceInput) {
  const preference = new Preference(getClient())

  const result = await preference.create({
    body: {
      items: [
        {
          id: input.registrationId,
          title: input.title,
          quantity: input.quantity,
          unit_price: input.unitPriceCents / 100,
          currency_id: "BRL",
        },
      ],
      payer: { email: input.buyerEmail },
      external_reference: input.registrationId,
      back_urls: {
        success: input.successUrl,
        failure: input.failureUrl,
        pending: input.pendingUrl,
      },
      auto_return: "approved",
      notification_url: input.notificationUrl,
    },
  })

  return {
    preferenceId: result.id as string,
    initPoint: result.init_point as string,
  }
}

/**
 * Consulta um pagamento pelo ID (usado no webhook para confirmar status).
 */
export async function getPayment(paymentId: string) {
  const payment = new Payment(getClient())
  return payment.get({ id: paymentId })
}
