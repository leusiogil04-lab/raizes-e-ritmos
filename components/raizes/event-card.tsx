"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { Calendar, MapPin, Users, ArrowUpRight } from "lucide-react"
import type { EventWithEditions } from "@/lib/types"
import {
  statusConfig,
  formatPrice,
  formatDateShort,
  audienceLabels,
  seatsLeft,
} from "@/lib/format"
import { track } from "@/lib/analytics"

const toneStyles: Record<string, string> = {
  open: "bg-accent text-wine",
  warning: "bg-terracotta text-cream",
  closed: "bg-wine/15 text-wine",
  soon: "bg-wine text-cream",
}

/** Escolhe a turma "principal" a exibir no card (a mais relevante para venda) */
function primaryEdition(event: EventWithEditions) {
  const priority: Record<string, number> = {
    inscricoes_abertas: 0,
    ultimas_vagas: 1,
    em_breve: 2,
    esgotado: 3,
    encerrado: 4,
  }
  return [...event.editions].sort(
    (a, b) => (priority[a.status] ?? 9) - (priority[b.status] ?? 9),
  )[0]
}

export function EventCard({
  event,
  index = 0,
}: {
  event: EventWithEditions
  index?: number
}) {
  const edition = primaryEdition(event)
  const status = statusConfig[edition?.status ?? "em_breve"]
  const spots = edition ? seatsLeft(edition.capacity, edition.seats_taken) : 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onViewportEnter={() => track("view_event", { eventId: event.id, slug: event.slug })}
      className="group flex flex-col overflow-hidden rounded-3xl border border-wine/10 bg-cream shadow-sm transition-shadow hover:shadow-xl"
    >
      <Link href={`/eventos/${event.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={event.cover_image || "/placeholder.svg"}
          alt={`${event.title} — ${audienceLabels[event.audience] ?? event.audience}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine/40 to-transparent" />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${toneStyles[status.tone]}`}
        >
          {status.label}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-cream/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-wine">
          {audienceLabels[event.audience] ?? event.audience}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6 text-wine md:p-7">
        <Link href={`/eventos/${event.slug}`}>
          <h3 className="font-serif text-2xl font-semibold leading-tight hover:text-terracotta">
            {event.title}
          </h3>
        </Link>
        {event.subtitle && (
          <p className="mt-1 text-sm font-medium text-terracotta">{event.subtitle}</p>
        )}
        <p className="mt-3 text-pretty text-sm leading-relaxed text-wine/70">
          {event.summary}
        </p>

        {edition && (
          <ul className="mt-5 space-y-2.5 text-sm text-wine/80">
            <li className="flex items-center gap-2.5">
              <Calendar className="size-4 shrink-0 text-terracotta" />
              <span>{formatDateShort(edition.starts_at)}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-terracotta" />
              <span>
                {edition.location_name}
                {edition.city ? ` — ${edition.city}` : ""}
              </span>
            </li>
            {edition.status !== "esgotado" && edition.status !== "encerrado" && spots > 0 && (
              <li className="flex items-center gap-2.5">
                <Users className="size-4 shrink-0 text-terracotta" />
                <span>{spots} vagas</span>
              </li>
            )}
          </ul>
        )}

        <div className="mt-6 flex items-end justify-between border-t border-wine/10 pt-5">
          <div>
            {edition && edition.price_cents > 0 ? (
              <p className="font-serif text-3xl font-semibold">
                {formatPrice(edition.price_cents, edition.currency)}
              </p>
            ) : (
              <p className="font-serif text-xl font-semibold text-wine/60">A definir</p>
            )}
          </div>
        </div>

        <Link
          href={`/eventos/${event.slug}`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-wine"
        >
          Ver detalhes
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </motion.article>
  )
}
