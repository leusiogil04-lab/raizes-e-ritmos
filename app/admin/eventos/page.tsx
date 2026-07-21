import Link from "next/link"
import { Plus } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AdminEventsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: events } = await supabase
    .from("events")
    .select("id, title, audience, is_published, is_featured, sort_order, editions(count)")
    .order("sort_order", { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Eventos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie as experiências oferecidas.</p>
        </div>
        <Link href="/admin/eventos/novo" className={buttonVariants()}>
          <Plus className="size-4" />
          Novo evento
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Público</TableHead>
              <TableHead>Turmas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(events ?? []).map((event) => {
              const editionCount = Array.isArray(event.editions) ? (event.editions[0]?.count ?? 0) : 0
              return (
                <TableRow key={event.id}>
                  <TableCell className="font-medium text-foreground">
                    {event.title}
                    {event.is_featured && (
                      <Badge variant="secondary" className="ml-2 align-middle">
                        Destaque
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{event.audience}</TableCell>
                  <TableCell className="text-muted-foreground">{editionCount}</TableCell>
                  <TableCell>
                    <Badge variant={event.is_published ? "default" : "outline"}>
                      {event.is_published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/eventos/${event.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Editar
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
            {(!events || events.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Nenhum evento cadastrado ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
