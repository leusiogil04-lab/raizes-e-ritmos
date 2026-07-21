"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Quote } from "lucide-react"
import { sectionsConfig } from "@/lib/site-config"
import type { Testimonial } from "@/lib/types"
import { Reveal } from "./reveal"

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null
  const copy = sectionsConfig.testimonials

  return (
    <section id="depoimentos" className="bg-cream py-24 text-wine md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
            {copy.eyebrow}
          </p>
          <h2 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {copy.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col rounded-3xl border border-wine/10 bg-muted/50 p-7"
            >
              <Quote className="size-8 text-terracotta" />
              <blockquote className="mt-4 flex-1 text-pretty text-lg leading-relaxed text-wine/85">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-wine/10 pt-5">
                {t.avatar_url ? (
                  <Image
                    src={t.avatar_url || "/placeholder.svg"}
                    alt={t.author}
                    width={44}
                    height={44}
                    className="size-11 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-11 items-center justify-center rounded-full bg-terracotta font-serif text-lg font-semibold text-cream">
                    {t.author.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="font-semibold">{t.author}</p>
                  {t.role && <p className="text-sm text-wine/60">{t.role}</p>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
