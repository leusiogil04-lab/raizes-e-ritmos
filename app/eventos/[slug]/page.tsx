import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check } from "lucide-react"
import { SiteHeader } from "@/components/raizes/site-header"
import { SiteFooter } from "@/components/raizes/site-footer"
import { EditionList } from "@/components/raizes/edition-list"
import { BackButton } from "@/components/raizes/back-button"
import { getEventBySlug, getSiteSettings } from "@/lib/data"
import { audienceLabels } from "@/lib/format"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: "Experiência não encontrada" }
  return {
    title: `${event.title} | Raízes e Ritmos`,
    description: event.summary ?? undefined,
    openGraph: {
      title: event.title,
      description: event.summary ?? undefined,
      images: event.cover_image ? [event.cover_image] : undefined,
    },
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [event, settings] = await Promise.all([
    getEventBySlug(slug),
    getSiteSettings(),
  ])

  if (!event) notFound()

  const gallery = event.gallery.length > 0 ? event.gallery : [event.cover_image].filter(Boolean)

  return (
    <>
      <SiteHeader />
      <main className="bg-cream text-wine">
        {/* Hero da experiência */}
        <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-wine text-cream">
          {event.cover_image && (
            <Image
              src={event.cover_image || "/placeholder.svg"}
              alt={event.title}
              fill
              priority
              className="object-cover opacity-60"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-wine via-wine/50 to-wine/20" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-24">
            <BackButton fallback="/eventos" className="mb-8" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-wine">
                {audienceLabels[event.audience] ?? event.audience}
              </span>
              {event.duration && (
                <span className="rounded-full border border-cream/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream/80">
                  {event.duration}
                </span>
              )}
            </div>
            <h1 className="mt-5 max-w-3xl text-balance font-serif text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="mt-4 text-xl text-cream/85 md:text-2xl">{event.subtitle}</p>
            )}
          </div>
        </section>

        {/* Conteúdo */}
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              {event.description && (
                <div className="prose-lg max-w-none">
                  <p className="text-pretty text-lg leading-relaxed text-wine/85">
                    {event.description}
                  </p>
                </div>
              )}

              {event.highlights.length > 0 && (
                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                  {event.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-3 rounded-2xl border border-wine/10 bg-muted/40 px-4 py-3.5 text-sm font-medium"
                    >
                      <Check className="size-5 shrink-0 text-terracotta" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {gallery.length > 1 && (
                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                  {gallery.map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className="relative aspect-[4/3] overflow-hidden rounded-3xl"
                    >
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`${event.title} — imagem ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Turmas */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="mb-5 font-serif text-3xl font-semibold">Turmas</h2>
              <EditionList
                editions={event.editions}
                eventSlug={event.slug}
                eventTitle={event.title}
                whatsapp={settings.contact.whatsapp}
              />
            </aside>
          </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <Link
              href="/eventos"
              className="text-sm font-semibold uppercase tracking-wide text-terracotta hover:text-wine"
            >
              Ver todas as experiências
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter contact={settings.contact} />
    </>
  )
}
