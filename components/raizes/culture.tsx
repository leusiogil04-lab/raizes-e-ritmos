"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { sectionsConfig } from "@/lib/site-config"
import { Reveal } from "./reveal"

export function Culture() {
  const { culture } = sectionsConfig
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y1 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"])
  const y2 = useTransform(scrollYProgress, [0, 1], ["-6%", "10%"])
  const y3 = useTransform(scrollYProgress, [0, 1], ["12%", "-10%"])
  const parallax = [y1, y2, y3]

  return (
    <section id="cultura" className="bg-terracotta py-24 text-cream md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-cream/70">
            {culture.eyebrow}
          </p>
          <h2 className="max-w-4xl text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {culture.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-cream/85">
            {culture.text}
          </p>
        </Reveal>

        <div ref={ref} className="mt-16 grid gap-4 sm:grid-cols-3">
          {culture.gallery.map((src, i) => (
            <motion.div
              key={src}
              style={{ y: parallax[i % parallax.length] }}
              className={`relative overflow-hidden rounded-2xl ${
                i === 1 ? "sm:mt-10" : ""
              }`}
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Cultura de Moçambique ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
