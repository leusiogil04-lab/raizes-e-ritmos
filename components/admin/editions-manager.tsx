"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { statusConfig } from "@/lib/format"
import type { Edition, EditionStatus } from "@/lib/types"
import { createEdition, updateEdition, deleteEdition } from "@/app/admin/eventos/edition-actions"

type ActionResult = { error?: string; success?: boolean }

const statusOptions = Object.entries(statusConfig).map(([value, cfg]) => ({
  value: value as EditionStatus,
  label: cfg.label,
}))

/** Converte ISO para o formato aceito por input datetime-local, no fuso local. */
function toLocalInput(iso: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60000)
  return local.toISOString().slice(0, 16)
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Salvando..." : label}
    </Button>
  )
}

function EditionFields({ edition }: { edition?: Edition }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label>Título da turma</Label>
        <Input name="title" defaultValue={edition?.title ?? ""} placeholder="Turma Novembro" />
      </div>
      <div className="grid gap-2">
        <Label>Data e hora</Label>
        <Input name="starts_at" type="datetime-local" defaultValue={toLocalInput(edition?.starts_at ?? null)} />
      </div>
      <div className="grid gap-2">
        <Label>Local</Label>
        <Input name="location_name" defaultValue={edition?.location_name ?? ""} placeholder="Casa de Cultura" />
      </div>
      <div className="grid gap-2">
        <Label>Cidade</Label>
        <Input name="city" defaultValue={edition?.city ?? ""} placeholder="São Paulo" />
      </div>
      <div className="grid gap-2 sm:col-span-2">
        <Label>Endereço</Label>
        <Input name="address" defaultValue={edition?.address ?? ""} />
      </div>
      <div className="grid gap-2">
        <Label>Preço (R$)</Label>
        <Input
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={edition ? (edition.price_cents / 100).toFixed(2) : "0"}
        />
      </div>
      <div className="grid gap-2">
        <Label>Status</Label>
        <select
          name="status"
          defaultValue={edition?.status ?? "inscricoes_abertas"}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label>Capacidade</Label>
        <Input name="capacity" type="number" min="0" defaultValue={edition?.capacity ?? 0} />
      </div>
      <div className="grid gap-2">
        <Label>Vagas ocupadas</Label>
        <Input name="seats_taken" type="number" min="0" defaultValue={edition?.seats_taken ?? 0} />
      </div>
      <div className="grid gap-2 sm:col-span-2">
        <Label>Link de checkout (Mercado Pago / externo)</Label>
        <Input name="checkout_url" defaultValue={edition?.checkout_url ?? ""} placeholder="https://..." />
      </div>
      <div className="grid gap-2">
        <Label>Ordem</Label>
        <Input name="sort_order" type="number" defaultValue={edition?.sort_order ?? 0} />
      </div>
      <div className="flex items-end gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={edition?.is_published ?? true}
            className="size-4 accent-primary"
          />
          Publicada
        </label>
      </div>
    </div>
  )
}

function ExistingEdition({ edition, eventId }: { edition: Edition; eventId: string }) {
  const [state, formAction] = useActionState(updateEdition.bind(null, edition.id, eventId), {} as ActionResult)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    else if (state?.success) toast.success("Turma atualizada")
  }, [state])

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-4">
          <EditionFields edition={edition} />
          <div className="flex items-center justify-between">
            <SubmitButton label="Salvar turma" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={async () => {
                if (confirm("Excluir esta turma?")) {
                  await deleteEdition(edition.id, eventId)
                  toast.success("Turma excluída")
                }
              }}
            >
              <Trash2 className="size-4" />
              Excluir
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function NewEdition({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useActionState(createEdition.bind(null, eventId), {} as ActionResult)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    else if (state?.success) {
      toast.success("Turma criada")
      setOpen(false)
    }
  }, [state])

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Adicionar turma
      </Button>
    )
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-4">
          <EditionFields />
          <div className="flex items-center gap-2">
            <SubmitButton label="Criar turma" />
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function EditionsManager({ eventId, editions }: { eventId: string; editions: Edition[] }) {
  return (
    <div className="flex flex-col gap-4">
      {editions.map((edition) => (
        <ExistingEdition key={edition.id} edition={edition} eventId={eventId} />
      ))}
      {editions.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhuma turma cadastrada. Adicione a primeira abaixo.</p>
      )}
      <NewEdition eventId={eventId} />
    </div>
  )
}
