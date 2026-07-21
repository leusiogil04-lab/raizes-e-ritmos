"use client"

import { Calendar, Clock, MapPin, Users } from "lucide-react"
import type { Edition } from "@/lib/types"
import {
  statusConfig,
  formatPrice,
  formatDate,
  formatTime,
  seatsLeft,
} from "@/lib/format"
import { CheckoutButton } from "@/components/raizes/checkout-button"

const toneBadge: Record<string, string> = {
  open: "bg-accent text-wine",
  warning: "bg-terracotta text-cream",
  closed: "bg-wine/15 text-wine",
  soon: "bg-wine text-cream",
}

const toneButton: Record<string, string> = {
  open: "bg-terracotta text-cream hover:bg-wine",
  warning: "bg-terracotta text-cream hover:bg-wine",
  closed: "cursor-not-allowed bg-wine/10 text-wine/50",
  soon: "cursor-not-allowed bg-wine/10 text-wine/50",
}

export function EditionList({
  editions,
  eventSlug,
  eventTitle,
  whatsapp,
}: {
  editions: Edition[]
  eventSlug: string
  eventTitle: string
  whatsapp: string
}) {
  if (editions.length === 0) {
    return (
      <p className="rounded-2xl border border-wine/10 bg-cream/60 p-6 text-wine/70">
        Nenhuma turma disponível no momento. Volte em breve.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {editions.map((ed) => {
        const status = statusConfig[ed.status]
        const spots = seatsLeft(ed.capacity, ed.seats_taken)
        const canBuy = status.actionable && ed.price_cents > 0

        return (
          <div
            key={ed.id}
            className="flex flex-col gap-5 rounded-3xl border border-wine/10 bg-cream p-6 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneBadge[status.tone]}`}
                >
                  {status.label}
                </span>
                {ed.title && (
                  <span className="text-sm font-medium text-wine/60">{ed.title}</span>
                )}
              </div>

              <ul className="mt-4 grid gap-2.5 text-sm text-wine/80 sm:grid-cols-2">
                <li className="flex items-center gap-2.5">
                  <Calendar className="size-4 shrink-0 text-terracotta" />
                  <span>{formatDate(ed.starts_at)}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="size-4 shrink-0 text-terracotta" />
                  <span>{formatTime(ed.starts_at)}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="size-4 shrink-0 text-terracotta" />
                  <span>
                    {ed.location_name}
                    {ed.city ? ` — ${ed.city}` : ""}
                  </span>
                </li>
                {status.tone !== "closed" && spots > 0 && (
                  <li className="flex items-center gap-2.5">
                    <Users className="size-4 shrink-0 text-terracotta" />
                    <span>{spots} vagas restantes</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-3 border-t border-wine/10 pt-5 md:items-end md:border-l md:border-t-0 md:pl-6 md:pt-0">
              {ed.price_cents > 0 ? (
                <p className="font-serif text-3xl font-semibold text-wine">
                  {formatPrice(ed.price_cents, ed.currency)}
                </p>
              ) : (
                <p className="font-serif text-xl font-semibold text-wine/60">A definir</p>
              )}

              {canBuy ? (
                <CheckoutButton
                  edition={ed}
                  eventSlug={eventSlug}
                  eventTitle={eventTitle}
                  whatsapp={whatsapp}
                  label={status.cta}
                  className={`inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors ${toneButton[status.tone]}`}
                />
              ) : (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-wide ${toneButton[status.tone]}`}
                >
                  {status.cta}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
