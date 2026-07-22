import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice, formatDate } from "@/lib/format"

const statusLabels: Record<
  string,
  {
    label: string
    variant:
      | "default"
      | "secondary"
      | "outline"
      | "destructive"
  }
> = {
  paid: {
    label: "Pago",
    variant: "default",
  },

  confirmed: {
    label: "Inscrito",
    variant: "default",
  },

  pending: {
    label: "Pendente",
    variant: "secondary",
  },

  failed: {
    label: "Falhou",
    variant: "destructive",
  },

  cancelled: {
    label: "Cancelado",
    variant: "outline",
  },

  refunded: {
    label: "Reembolsado",
    variant: "outline",
  },
}

export default async function AdminRegistrationsPage() {
  await requireAdmin()

  const supabase = await createClient()

  const { data: registrations, error } = await supabase
    .from("registrations")
    .select(
      "id, buyer_name, buyer_email, buyer_phone, quantity, amount_cents, status, created_at, editions(title, events(title))",
    )
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    console.error(
      "Erro ao carregar inscrições:",
      error.message,
    )
  }

  const rows = registrations ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-foreground">
          Inscrições
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Todas as inscrições e compras registradas.
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Comprador
              </TableHead>

              <TableHead>
                Evento / Turma
              </TableHead>

              <TableHead>
                Qtd
              </TableHead>

              <TableHead>
                Valor
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Data
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((r) => {
              // O Supabase está retornando editions como array.
              // Pegamos o primeiro registro relacionado.
              const edition = Array.isArray(r.editions)
                ? r.editions[0]
                : r.editions

              // O relacionamento events também pode vir como array.
              const event = edition?.events
                ? Array.isArray(edition.events)
                  ? edition.events[0]
                  : edition.events
                : null

              const editionTitle =
                edition?.title ?? "—"

              const eventTitle =
                event?.title ?? "—"

              const status =
                statusLabels[r.status] ?? {
                  label: r.status,
                  variant: "outline" as const,
                }

              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">
                      {r.buyer_name}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {r.buyer_email}
                    </div>

                    {r.buyer_phone && (
                      <div className="text-xs text-muted-foreground">
                        {r.buyer_phone}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="text-foreground">
                      {eventTitle}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {editionTitle}
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {r.quantity}
                  </TableCell>

                  <TableCell className="text-foreground">
                    {formatPrice(r.amount_cents)}
                  </TableCell>

                  <TableCell>
                    <Badge variant={status.variant}>
                      {status.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {formatDate(r.created_at)}
                  </TableCell>
                </TableRow>
              )
            })}

            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  Nenhuma inscrição registrada ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}