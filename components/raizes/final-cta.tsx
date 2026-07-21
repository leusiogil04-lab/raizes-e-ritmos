"use client"

import { motion } from "motion/react"
import { sectionsConfig } from "@/lib/site-config"

export function FinalCta() {
  const { finalCta } = sectionsConfig

  return (
    <section className="relative overflow-hidden bg-terracotta py-28 text-cream md:py-40">
      {/* Ondas sonoras de fundo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 opacity-15 md:gap-2">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-cream md:w-1.5"
            initial={{ height: 20 }}
            animate={{ height: [20, 40 + (i % 9) * 22, 20] }}
            transition={{
              duration: 1.4 + (i % 6) * 0.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.03,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {finalCta.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-cream/85"
        >
          {finalCta.text}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <a
            href="#eventos"
            className="mt-10 inline-block rounded-full bg-cream px-10 py-4 text-sm font-semibold uppercase tracking-wide text-wine transition-transform hover:scale-105"
          >
            {finalCta.cta}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
