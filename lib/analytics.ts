/**
 * =====================================================================
 * ANALYTICS — Camada única de rastreamento
 * =====================================================================
 *
 * Integra:
 * - Meta Pixel
 * - Google Analytics (GA4)
 * - Google Tag Manager (GTM)
 *
 * IDs definidos nas variáveis de ambiente:
 *
 * NEXT_PUBLIC_META_PIXEL_ID
 * NEXT_PUBLIC_GA_ID
 * NEXT_PUBLIC_GTM_ID
 *
 * Eventos internos são mapeados para eventos padrão do Meta Pixel.
 * =====================================================================
 */

export type AnalyticsEvent =
  | "page_view"
  | "view_event"
  | "click_checkout"
  | "checkout_redirect"
  | "select_event"
  | "purchase"
  | "lead"
  | "free_registration"

type Payload = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: unknown[]
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * IDs das plataformas de analytics.
 */
export const analyticsIds = {
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  ga: process.env.NEXT_PUBLIC_GA_ID ?? "",
  gtm: process.env.NEXT_PUBLIC_GTM_ID ?? "",
}

/**
 * Mapeamento dos eventos internos para eventos padrão
 * reconhecidos pelo Meta Pixel.
 *
 * Evento interno          Meta Pixel
 * ------------------------------------------------
 * page_view               PageView
 * view_event              ViewContent
 * click_checkout          InitiateCheckout
 * checkout_redirect       InitiateCheckout
 * select_event            ViewContent
 * purchase                Purchase
 * lead                    Lead
 * free_registration       CompleteRegistration
 */
const metaEventMap: Record<AnalyticsEvent, string> = {
  page_view: "PageView",
  view_event: "ViewContent",
  click_checkout: "InitiateCheckout",
  checkout_redirect: "InitiateCheckout",
  select_event: "ViewContent",
  purchase: "Purchase",
  lead: "Lead",
  free_registration: "CompleteRegistration",
}

/**
 * Eventos padrão do Meta Pixel.
 *
 * Esses eventos devem ser enviados usando:
 *
 * fbq("track", ...)
 *
 * Eventos que não estiverem nessa lista serão enviados como:
 *
 * fbq("trackCustom", ...)
 */
const standardMetaEvents = new Set([
  "PageView",
  "ViewContent",
  "InitiateCheckout",
  "Purchase",
  "Lead",
  "CompleteRegistration",
])

/**
 * Dispara um evento para:
 *
 * - Google Tag Manager
 * - Meta Pixel
 * - Google Analytics
 *
 * Exemplo:
 *
 * track("click_checkout", {
 *   eventSlug: "raizes-e-ritmos",
 *   editionId: "adultos-julho",
 *   value: 0,
 *   currency: "BRL",
 * })
 */
export function track(
  event: AnalyticsEvent,
  payload: Payload = {},
) {
  /**
   * Evita executar código que depende do navegador
   * durante o Server-Side Rendering do Next.js.
   */
  if (typeof window === "undefined") {
    return
  }

  /**
   * ================================================================
   * GOOGLE TAG MANAGER
   * ================================================================
   *
   * O evento é enviado para o dataLayer com o nome interno.
   *
   * Exemplo:
   *
   * {
   *   event: "free_registration",
   *   editionId: "...",
   *   eventSlug: "...",
   * }
   */
  if (window.dataLayer) {
    window.dataLayer.push({
      event,
      ...payload,
    })
  }

  /**
   * ================================================================
   * META PIXEL
   * ================================================================
   *
   * Converte o evento interno para o evento padrão do Meta.
   *
   * Exemplo:
   *
   * track("free_registration")
   *
   * será enviado para o Meta como:
   *
   * fbq("track", "CompleteRegistration")
   */
  if (
    window.fbq &&
    analyticsIds.metaPixel
  ) {
    const metaEvent = metaEventMap[event]

    if (standardMetaEvents.has(metaEvent)) {
      window.fbq(
        "track",
        metaEvent,
        payload,
      )
    } else {
      window.fbq(
        "trackCustom",
        metaEvent,
        payload,
      )
    }
  }

  /**
   * ================================================================
   * GOOGLE ANALYTICS — GA4
   * ================================================================
   *
   * Mantém o nome interno do evento.
   *
   * Exemplo:
   *
   * free_registration
   *
   * será enviado ao GA4 como:
   *
   * free_registration
   */
  if (
    window.gtag &&
    analyticsIds.ga
  ) {
    window.gtag(
      "event",
      event,
      payload,
    )
  }

  /**
   * ================================================================
   * LOG DE DESENVOLVIMENTO
   * ================================================================
   *
   * Ajuda a verificar os eventos no console
   * enquanto o site está em desenvolvimento.
   */
  if (
    process.env.NODE_ENV !== "production"
  ) {
    console.log(
      "[Analytics]",
      {
        event,
        payload,
        metaEvent:
          metaEventMap[event],
      },
    )
  }
}