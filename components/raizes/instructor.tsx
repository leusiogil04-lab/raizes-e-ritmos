"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import type { InstructorSettings } from "@/lib/types"
import { Reveal } from "./reveal"

export function Instructor({
  instructor,
  instagram,
}: {
  instructor: InstructorSettings
  instagram?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["-12%", "12%"]
  )

  const roles = instructor.role
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean)

  return (
    <section
      id="leusio"
      className="bg-wine py-24 text-cream md:py-36"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">

        {/* ===================================================== */}
        {/* IMAGEM DO FACILITADOR */}
        {/* ===================================================== */}

        <div
          ref={ref}
          className="relative order-2 overflow-hidden rounded-3xl md:order-1"
        >
          <motion.div
            style={{ y }}
            className="relative aspect-[4/5] w-full scale-110"
          >
            <Image
              src={instructor.image || "/placeholder.svg"}
              alt={instructor.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* ===================================================== */}
        {/* INFORMAÇÕES DO FACILITADOR */}
        {/* ===================================================== */}

        <div className="order-1 md:order-2">

          {/* Nome */}

          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
              O facilitador
            </p>

            <h2 className="font-serif text-5xl font-semibold leading-none tracking-tight md:text-6xl lg:text-7xl">
              {instructor.name}
            </h2>
          </Reveal>

          {/* Funções / Especialidades */}

          <Reveal delay={0.1}>
            <div className="mt-6 flex flex-wrap gap-2">
              {roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-cream/25 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-cream/80"
                >
                  {role}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Biografia */}

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-cream/80">
              {instructor.bio}
            </p>
          </Reveal>

          {/* Instagram */}

          {instagram && (
            <Reveal delay={0.3}>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-wine transition-transform hover:scale-105"
              >
                Siga-me no Instagram
                <ArrowUpRight className="size-4" />
              </a>
            </Reveal>
          )}

        </div>
      </div>
    </section>
  )
}