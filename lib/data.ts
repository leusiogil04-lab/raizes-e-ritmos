import { createClient } from "@/lib/supabase/server"
import type {
  EventWithEditions,
  EventRecord,
  Edition,
  Testimonial,
  Faq,
  SiteSettings,
  BrandSettings,
  HeroSettings,
  InstructorSettings,
  ContactSettings,
} from "@/lib/types"

/* ---------------------------------------------------------------------
 *  CAMADA DE DADOS (Server Components)
 *  Todas as leituras públicas do site passam por aqui.
 * ------------------------------------------------------------------- */

const DEFAULT_SETTINGS: SiteSettings = {
  brand: {
    name: "Raízes e Ritmos",
    tagline: "Experiências musicais interculturais de Moçambique",
    description:
      "Vivências de música, ritmo e movimento conduzidas por Leusio Gil.",
  },
  hero: {
    eyebrow: "Cultura viva de Moçambique",
    title: "Onde as raízes encontram o ritmo",
    subtitle:
      "Oficinas presenciais de música intercultural que despertam o corpo, a escuta e a coletividade.",
    cta_label: "Garantir minha vaga",
    cta_href: "#eventos",
    image: "/images/hero.png",
  },
  instructor: {
    name: "Leusio Gil",
    role: "Músico e educador moçambicano",
    bio: "Leusio Gil é músico, Compositor e educador nascido em Moçambique.",
    image: "/images/fotobioleusiogil.jpg",
  },
  contact: {
    whatsapp: "https://wa.me/5500000000000",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    email: "contato@raizeseritmos.com",
  },
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("site_settings").select("key, value")

  if (error || !data) return DEFAULT_SETTINGS

  const map = new Map(data.map((row) => [row.key, row.value]))
  return {
    brand: (map.get("brand") as BrandSettings) ?? DEFAULT_SETTINGS.brand,
    hero: (map.get("hero") as HeroSettings) ?? DEFAULT_SETTINGS.hero,
    instructor:
      (map.get("instructor") as InstructorSettings) ?? DEFAULT_SETTINGS.instructor,
    contact: (map.get("contact") as ContactSettings) ?? DEFAULT_SETTINGS.contact,
  }
}

export async function getEventsWithEditions(): Promise<EventWithEditions[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("events")
    .select("*, editions(*)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })

  if (error || !data) return []

  return (data as (EventRecord & { editions: Edition[] })[]).map((event) => ({
    ...event,
    editions: (event.editions ?? [])
      .filter((ed) => ed.is_published)
      .sort((a, b) => a.sort_order - b.sort_order),
  }))
}

export async function getFeaturedEvents(): Promise<EventWithEditions[]> {
  const all = await getEventsWithEditions()
  return all.filter((e) => e.is_featured)
}

export async function getEventBySlug(
  slug: string,
): Promise<EventWithEditions | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("events")
    .select("*, editions(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()

  if (error || !data) return null

  const event = data as EventRecord & { editions: Edition[] }
  return {
    ...event,
    editions: (event.editions ?? [])
      .filter((ed) => ed.is_published)
      .sort((a, b) => a.sort_order - b.sort_order),
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })

  if (error || !data) return []
  return data as Testimonial[]
}

export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })

  if (error || !data) return []
  return data as Faq[]
}
