"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

function parseList(value: FormDataEntryValue | null): string[] {
  if (!value) return []
  return String(value)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

type ActionResult = { error?: string }

function buildEventPayload(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim()
  const slugInput = String(formData.get("slug") ?? "").trim()
  return {
    title,
    slug: slugInput ? slugify(slugInput) : slugify(title),
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    summary: String(formData.get("summary") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    category: String(formData.get("category") ?? "workshop").trim() || "workshop",
    audience: String(formData.get("audience") ?? "todos"),
    cover_image: String(formData.get("cover_image") ?? "").trim() || null,
    duration: String(formData.get("duration") ?? "").trim() || null,
    gallery: parseList(formData.get("gallery")),
    highlights: parseList(formData.get("highlights")),
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  }
}

export async function createEvent(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const payload = buildEventPayload(formData)

  if (!payload.title) return { error: "O título é obrigatório." }

  const { data, error } = await supabase.from("events").insert(payload).select("id").single()
  if (error) return { error: error.message }

  revalidatePath("/admin/eventos")
  revalidatePath("/eventos")
  revalidatePath("/")
  redirect(`/admin/eventos/${data.id}`)
}

export async function updateEvent(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const payload = buildEventPayload(formData)

  if (!payload.title) return { error: "O título é obrigatório." }

  const { error } = await supabase
    .from("events")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/eventos")
  revalidatePath(`/admin/eventos/${id}`)
  revalidatePath("/eventos")
  revalidatePath("/")
  return {}
}

export async function toggleEventPublished(id: string, next: boolean): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from("events").update({ is_published: next, updated_at: new Date().toISOString() }).eq("id", id)
  revalidatePath("/admin/eventos")
  revalidatePath("/eventos")
  revalidatePath("/")
}

export async function deleteEvent(id: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from("events").delete().eq("id", id)
  revalidatePath("/admin/eventos")
  revalidatePath("/eventos")
  revalidatePath("/")
  redirect("/admin/eventos")
}
