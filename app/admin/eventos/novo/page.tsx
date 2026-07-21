import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { EventForm } from "@/components/admin/event-form"
import { createEvent } from "../actions"

export default async function NewEventPage() {
  await requireAdmin()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/eventos"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <h1 className="font-serif text-3xl text-foreground">Novo evento</h1>
      </div>
      <Card>
        <CardContent className="pt-6">
          <EventForm action={createEvent} submitLabel="Criar evento" />
        </CardContent>
      </Card>
    </div>
  )
}
