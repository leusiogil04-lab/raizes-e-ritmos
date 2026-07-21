"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

type ActionResult = { error?: string; success?: boolean }

function buildEditionPayload(formData: FormData) {
  const startsAt = String(formData.get("starts_at") ?? "").trim()
  const priceReais = Number(formData.get("price") ?? 0)
  return {
    title: String(formData.get("title") ?? "").trim() || null,
    starts_at: startsAt ? new Date(startsAt).toISOString() : null,
    location_name: String(formData.get("location_name") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    capacity: Number(formData.get("capacity") ?? 0) || 0,
    seats_taken: Number(formData.get("seats_taken") ?? 0) || 0,
    price_cents: Math.round((Number.isFinite(priceReais) ? priceReais : 0) * 100),
    checkout_url: String(formData.get("checkout_url") ?? "").trim() || null,
    status: String(formData.get("status") ?? "inscricoes_abertas"),
    is_published: formData.get("is_published") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  }
}

function revalidateEvent() {
  revalidatePath("/eventos")
  revalidatePath("/")
}

export async function createEdition(
  eventId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const payload = buildEditionPayload(formData)

  const { error } = await supabase.from("editions").insert({ ...payload, event_id: eventId })
  if (error) return { error: error.message }

  revalidatePath(`/admin/eventos/${eventId}`)
  revalidateEvent()
  return { success: true }
}

export async function updateEdition(
  editionId: string,
  eventId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const payload = buildEditionPayload(formData)

  const { error } = await supabase
    .from("editions")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", editionId)
  if (error) return { error: error.message }

  revalidatePath(`/admin/eventos/${eventId}`)
  revalidateEvent()
  return { success: true }
}

export async function deleteEdition(editionId: string, eventId: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from("editions").delete().eq("id", editionId)
  revalidatePath(`/admin/eventos/${eventId}`)
  revalidateEvent()
}
