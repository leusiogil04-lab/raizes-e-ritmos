"use client"

import { sectionsConfig } from "@/lib/site-config"
import { Reveal } from "./reveal"
import { KeywordMarquee } from "./keyword-marquee"

export function Experience() {
  const { experience } = sectionsConfig

  return (
    <section id="experiencia" className="bg-cream py-24 text-wine md:py-36">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <Reveal>
          <h2 className="text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {experience.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? <span className="italic text-terracotta">{line}</span> : line}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-wine/75 md:text-xl">
            {experience.text}
          </p>
        </Reveal>
      </div>

      <div className="mt-16 border-y border-wine/10 py-6 text-terracotta md:mt-24">
        <KeywordMarquee words={experience.keywords} />
      </div>
    </section>
  )
}
