"use client"

import { events, sectionsConfig, type EventStatus } from "@/lib/site-config"
import { Reveal } from "./reveal"
import { EventCard } from "./event-card"

// Somente eventos ativos aparecem aqui (nunca encerrados)
const VISIBLE: EventStatus[] = [
  "em_breve",
  "inscricoes_abertas",
  "ultimas_vagas",
  "turma_quase_lotada",
]

export function Upcoming() {
  const upcoming = events.filter((e) => VISIBLE.includes(e.status))
  if (upcoming.length === 0) return null

  return (
    <section id="proximos" className="bg-cream py-24 text-wine md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
            {sectionsConfig.upcoming.eyebrow}
          </p>
          <h2 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {sectionsConfig.upcoming.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
