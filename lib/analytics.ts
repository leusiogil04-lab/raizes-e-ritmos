/**
 * =====================================================================
 *  ANALYTICS — Camada única de rastreamento
 * =====================================================================
 *
 *  Prepara o site para Meta Pixel, Google Analytics e GTM.
 *  Os IDs reais devem ser definidos nas variáveis de ambiente:
 *
 *    NEXT_PUBLIC_META_PIXEL_ID
 *    NEXT_PUBLIC_GA_ID
 *    NEXT_PUBLIC_GTM_ID
 *
 *  Enquanto os IDs não existirem, os eventos apenas são logados no
 *  console (modo desenvolvimento) e nada é enviado.
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

export const analyticsIds = {
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  ga: process.env.NEXT_PUBLIC_GA_ID ?? "",
  gtm: process.env.NEXT_PUBLIC_GTM_ID ?? "",
}

/**
 * Dispara um evento para todas as plataformas configuradas.
 * Uso: track("click_checkout", { eventId: "adultos-julho" })
 */
export function track(event: AnalyticsEvent, payload: Payload = {}) {
  if (typeof window === "undefined") return

  // Google Tag Manager (dataLayer)
  if (window.dataLayer) {
    window.dataLayer.push({ event, ...payload })
  }

  // Meta Pixel
  if (window.fbq && analyticsIds.metaPixel) {
    window.fbq("trackCustom", event, payload)
  }

  // Google Analytics (gtag)
  if (window.gtag && analyticsIds.ga) {
    window.gtag("event", event, payload)
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[v0] analytics:", event, payload)
  }
}
