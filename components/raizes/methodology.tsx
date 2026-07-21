"use client"

import { sectionsConfig } from "@/lib/site-config"
import { Reveal } from "./reveal"
import { KeywordMarquee } from "./keyword-marquee"

export function Methodology() {
  const { methodology } = sectionsConfig

  return (
    <section id="metodologia" className="bg-cream py-24 text-wine md:py-36">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
            {methodology.eyebrow}
          </p>
          <h2 className="text-balance font-serif text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {methodology.title}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-3xl text-pretty text-lg leading-relaxed text-wine/75">
            {methodology.text}
          </p>
        </Reveal>
      </div>

      <div className="my-14 border-y border-wine/10 py-6 text-terracotta">
        <KeywordMarquee words={methodology.keywords} reverse />
      </div>

      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <Reveal>
          <p className="rounded-2xl border border-wine/10 bg-muted/60 p-6 text-sm italic leading-relaxed text-wine/70">
            {methodology.note}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
