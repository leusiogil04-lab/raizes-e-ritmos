"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Plus } from "lucide-react"
import { sectionsConfig } from "@/lib/site-config"
import type { Faq as FaqType } from "@/lib/types"
import { Reveal } from "./reveal"

export function Faq({ faqs }: { faqs: FaqType[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const copy = sectionsConfig.faq

  if (faqs.length === 0) return null

  return (
    <section id="faq" className="bg-wine py-24 text-cream md:py-36">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {copy.eyebrow}
          </p>
          <h2 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {copy.title}
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-cream/15 border-y border-cream/15">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.id}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-xl font-medium md:text-2xl">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-accent"
                  >
                    <Plus className="size-6" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-pretty text-base leading-relaxed text-cream/75 md:max-w-2xl">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
