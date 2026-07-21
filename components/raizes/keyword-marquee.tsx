"use client"

import { motion } from "motion/react"

interface KeywordMarqueeProps {
  words: string[]
  /** Direção da rolagem */
  reverse?: boolean
  className?: string
}

/**
 * Faixa infinita de palavras-chave animadas (música, ritmo, canto...).
 * Usada nas seções "A Experiência" e "Metodologia".
 */
export function KeywordMarquee({ words, reverse, className }: KeywordMarqueeProps) {
  const loop = [...words, ...words]
  return (
    <div className={`relative overflow-hidden py-2 ${className ?? ""}`}>
      <motion.div
        className="flex w-max items-center gap-6 md:gap-10"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      >
        {loop.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-6 md:gap-10">
            <span className="font-serif text-4xl italic tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {word}
            </span>
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
