/**
 * Tipos de dados da plataforma Raízes e Ritmos.
 * Espelham o schema do banco Supabase.
 */

export type EditionStatus =
  | "em_breve"
  | "inscricoes_abertas"
  | "ultimas_vagas"
  | "esgotado"
  | "encerrado"

export type Audience = "todos" | "adultos" | "criancas" | "familias" | "empresas"

export interface Edition {
  id: string
  event_id: string
  title: string | null
  starts_at: string | null
  ends_at: string | null
  location_name: string | null
  address: string | null
  city: string | null
  capacity: number
  seats_taken: number
  price_cents: number
  currency: string
  checkout_url: string | null
  status: EditionStatus
  is_published: boolean
  sort_order: number
}

export interface EventRecord {
  id: string
  slug: string
  title: string
  subtitle: string | null
  summary: string | null
  description: string | null
  category: string
  audience: Audience
  cover_image: string | null
  gallery: string[]
  highlights: string[]
  duration: string | null
  is_published: boolean
  is_featured: boolean
  sort_order: number
}

export interface EventWithEditions extends EventRecord {
  editions: Edition[]
}

export interface Testimonial {
  id: string
  author: string
  role: string | null
  quote: string
  avatar_url: string | null
  sort_order: number
}

export interface Faq {
  id: string
  question: string
  answer: string
  sort_order: number
}

export interface Registration {
  id: string
  edition_id: string
  user_id: string | null
  buyer_name: string
  buyer_email: string
  buyer_phone: string | null
  quantity: number
  amount_cents: number
  currency: string
  status: "pending" | "paid" | "failed" | "cancelled" | "refunded"
  payment_provider: string | null
  provider_payment_id: string | null
  provider_preference_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: "user" | "admin"
}

/* Site settings tipados por chave */
export interface BrandSettings {
  name: string
  tagline: string
  description: string
}
export interface HeroSettings {
  eyebrow: string
  title: string
  subtitle: string
  cta_label: string
  cta_href: string
  image: string
}
export interface InstructorSettings {
  name: string
  role: string
  bio: string
  image: string
}
export interface ContactSettings {
  whatsapp: string
  instagram: string
  youtube: string
  email: string
}
export interface SiteSettings {
  brand: BrandSettings
  hero: HeroSettings
  instructor: InstructorSettings
  contact: ContactSettings
}
