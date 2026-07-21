import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { EventForm } from "@/components/admin/event-form"
import { EditionsManager } from "@/components/admin/editions-manager"
import { DeleteEventButton } from "@/components/admin/delete-event-button"
import { updateEvent } from "../actions"
import type { Edition, EventRecord } from "@/lib/types"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single()
  if (!event) notFound()

  const { data: editions } = await supabase
    .from("editions")
    .select("*")
    .eq("event_id", id)
    .order("sort_order", { ascending: true })

  const typedEvent = event as EventRecord
  const updateAction = updateEvent.bind(null, id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/eventos"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
          <h1 className="font-serif text-3xl text-foreground text-balance">{typedEvent.title}</h1>
        </div>
        <Link
          href={`/eventos/${typedEvent.slug}`}
          target="_blank"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Ver no site
          <ExternalLink className="size-4" />
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do evento</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm action={updateAction} event={typedEvent} submitLabel="Salvar alterações" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Turmas e datas</CardTitle>
        </CardHeader>
        <CardContent>
          <EditionsManager eventId={id} editions={(editions ?? []) as Edition[]} />
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de perigo</CardTitle>
        </CardHeader>
        <CardContent>
          <DeleteEventButton eventId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
