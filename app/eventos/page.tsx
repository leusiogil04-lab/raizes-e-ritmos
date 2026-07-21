import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/raizes/site-header"
import { SiteFooter } from "@/components/raizes/site-footer"
import { EventCard } from "@/components/raizes/event-card"
import { BackButton } from "@/components/raizes/back-button"
import { getEventsWithEditions, getSiteSettings } from "@/lib/data"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Experiências | Raízes e Ritmos",
  description:
    "Conheça todas as vivências e oficinas de música intercultural de Moçambique.",
}

export default async function EventosPage() {
  const [events, settings] = await Promise.all([
    getEventsWithEditions(),
    getSiteSettings(),
  ])

  return (
    <>
      <SiteHeader />
      <main className="bg-cream text-wine">
        <section className="bg-wine px-5 pb-20 pt-32 text-cream md:px-8 md:pb-28 md:pt-40">
          <div className="mx-auto max-w-7xl">
            <BackButton fallback="/" className="mb-8" />
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
              Experiências
            </p>
            <h1 className="max-w-3xl text-balance font-serif text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
              Escolha a vivência que combina com você
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-cream/80">
              Oficinas presenciais de música, ritmo e movimento conduzidas por
              Leusio Gil. Selecione uma experiência para ver as turmas disponíveis.
            </p>
          </div>
        </section>

        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            {events.length === 0 ? (
              <p className="text-wine/70">Nenhuma experiência publicada no momento.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            )}

            <div className="mt-16 text-center">
              <Link
                href="/"
                className="text-sm font-semibold uppercase tracking-wide text-terracotta hover:text-wine"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter contact={settings.contact} />
    </>
  )
}
