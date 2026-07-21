"use client"

import { sectionsConfig } from "@/lib/site-config"
import type { EventWithEditions } from "@/lib/types"
import { Reveal } from "./reveal"
import { EventCard } from "./event-card"

export function Events({ events }: { events: EventWithEditions[] }) {
  if (events.length === 0) return null

  return (
    <section id="eventos" className="bg-earth py-24 text-cream md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {sectionsConfig.events.eyebrow}
          </p>
          <h2 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {sectionsConfig.events.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
