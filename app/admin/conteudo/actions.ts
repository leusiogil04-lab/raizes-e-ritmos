"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

type ActionResult = { error?: string; success?: boolean }

function revalidatePublic() {
  revalidatePath("/")
  revalidatePath("/admin/conteudo")
}

/* ---------------- SITE SETTINGS ---------------- */
export async function updateSettings(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()

  const hero = {
    eyebrow: String(formData.get("hero_eyebrow") ?? ""),
    title: String(formData.get("hero_title") ?? ""),
    subtitle: String(formData.get("hero_subtitle") ?? ""),
    cta_label: String(formData.get("hero_cta_label") ?? ""),
    cta_href: String(formData.get("hero_cta_href") ?? "#eventos"),
    image: String(formData.get("hero_image") ?? ""),
  }
  const instructor = {
    name: String(formData.get("instructor_name") ?? ""),
    role: String(formData.get("instructor_role") ?? ""),
    bio: String(formData.get("instructor_bio") ?? ""),
    image: String(formData.get("instructor_image") ?? ""),
  }
  const contact = {
    whatsapp: String(formData.get("contact_whatsapp") ?? ""),
    instagram: String(formData.get("contact_instagram") ?? ""),
    youtube: String(formData.get("contact_youtube") ?? ""),
    email: String(formData.get("contact_email") ?? ""),
  }

  const rows = [
    { key: "hero", value: hero },
    { key: "instructor", value: instructor },
    { key: "contact", value: contact },
  ]

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      rows.map((r) => ({ key: r.key, value: r.value, updated_at: new Date().toISOString() })),
      { onConflict: "key" },
    )
  if (error) return { error: error.message }

  revalidatePublic()
  return { success: true }
}

/* ---------------- TESTIMONIALS ---------------- */
export async function createTestimonial(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const payload = {
    author: String(formData.get("author") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim() || null,
    quote: String(formData.get("quote") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  }
  if (!payload.author || !payload.quote) return { error: "Autor e depoimento são obrigatórios." }

  const { error } = await supabase.from("testimonials").insert(payload)
  if (error) return { error: error.message }
  revalidatePublic()
  return { success: true }
}

export async function deleteTestimonial(id: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from("testimonials").delete().eq("id", id)
  revalidatePublic()
}

/* ---------------- FAQS ---------------- */
export async function createFaq(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const payload = {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  }
  if (!payload.question || !payload.answer) return { error: "Pergunta e resposta são obrigatórias." }

  const { error } = await supabase.from("faqs").insert(payload)
  if (error) return { error: error.message }
  revalidatePublic()
  return { success: true }
}

export async function deleteFaq(id: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from("faqs").delete().eq("id", id)
  revalidatePublic()
}
