"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { pastEvents, sectionsConfig } from "@/lib/site-config"
import { Reveal } from "./reveal"

export function PastEvents() {
  if (pastEvents.length === 0) return null
  const { past } = sectionsConfig

  return (
    <section id="historico" className="bg-earth py-24 text-cream md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {past.eyebrow}
          </p>
          <h2 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {past.title}
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-cream/75">
            {past.text}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((item, i) => (
            <motion.a
              key={item.id}
              href={item.videoUrl || "#"}
              target={item.videoUrl ? "_blank" : undefined}
              rel={item.videoUrl ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative block overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={`${item.title} — ${item.city}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wine via-wine/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {item.date}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-cream/80">{item.city}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
