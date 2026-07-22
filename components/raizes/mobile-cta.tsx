"use client"

import { MessageCircle } from "lucide-react"

/**
 * Barra fixa de CTA no mobile.
 * Fica sempre visível na parte inferior da tela.
 */
export function MobileCta({ whatsapp }: { whatsapp: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 border-t border-wine/10 bg-cream/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
        className="flex size-12 shrink-0 items-center justify-center rounded-full border border-wine/15 text-wine"
      >
        <MessageCircle className="size-5" />
      </a>

      <a
        href="#eventos"
        className="flex-1 rounded-full bg-terracotta py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-cream"
      >
        Garantir minha vaga
      </a>
    </div>
  )
}