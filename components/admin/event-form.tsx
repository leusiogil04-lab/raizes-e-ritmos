"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { EventRecord } from "@/lib/types"

type ActionResult = { error?: string }
type FormAction = (prev: ActionResult, formData: FormData) => Promise<ActionResult>

const audiences = [
  { value: "todos", label: "Todos" },
  { value: "adultos", label: "Adultos" },
  { value: "criancas", label: "Crianças" },
  { value: "familias", label: "Famílias" },
  { value: "empresas", label: "Empresas" },
]

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : label}
    </Button>
  )
}

export function EventForm({
  action,
  event,
  submitLabel,
}: {
  action: FormAction
  event?: EventRecord
  submitLabel: string
}) {
  const [state, formAction] = useActionState(action, {})

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="title">Título *</Label>
          <Input id="title" name="title" defaultValue={event?.title ?? ""} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" name="slug" defaultValue={event?.slug ?? ""} placeholder="gerado do título" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duration">Duração</Label>
          <Input id="duration" name="duration" defaultValue={event?.duration ?? ""} placeholder="3 horas" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Categoria</Label>
          <Input id="category" name="category" defaultValue={event?.category ?? "workshop"} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="audience">Público</Label>
          <select
            id="audience"
            name="audience"
            defaultValue={event?.audience ?? "todos"}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {audiences.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input id="subtitle" name="subtitle" defaultValue={event?.subtitle ?? ""} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="summary">Resumo (aparece nos cards)</Label>
          <Textarea id="summary" name="summary" defaultValue={event?.summary ?? ""} rows={2} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="description">Descrição completa</Label>
          <Textarea id="description" name="description" defaultValue={event?.description ?? ""} rows={5} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="cover_image">Imagem de capa (URL)</Label>
          <Input id="cover_image" name="cover_image" defaultValue={event?.cover_image ?? ""} placeholder="/images/..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gallery">Galeria (uma URL por linha)</Label>
          <Textarea id="gallery" name="gallery" defaultValue={(event?.gallery ?? []).join("\n")} rows={3} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="highlights">Destaques (um por linha)</Label>
          <Textarea id="highlights" name="highlights" defaultValue={(event?.highlights ?? []).join("\n")} rows={3} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sort_order">Ordem</Label>
          <Input id="sort_order" name="sort_order" type="number" defaultValue={event?.sort_order ?? 0} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch id="is_published" name="is_published" defaultChecked={event?.is_published ?? true} />
          <Label htmlFor="is_published">Publicado</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="is_featured" name="is_featured" defaultChecked={event?.is_featured ?? false} />
          <Label htmlFor="is_featured">Destaque na home</Label>
        </div>
      </div>

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}
