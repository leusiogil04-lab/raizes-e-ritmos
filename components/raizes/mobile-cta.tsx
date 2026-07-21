"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { MessageCircle } from "lucide-react"

/**
 * Barra fixa de CTA no mobile: sempre acessível para levar às inscrições.
 * Aparece após o usuário rolar além do Hero.
 */
export function MobileCta({ whatsapp }: { whatsapp: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 border-t border-wine/10 bg-cream/95 p-3 backdrop-blur-md md:hidden"
        >
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
