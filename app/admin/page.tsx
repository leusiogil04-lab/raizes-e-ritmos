import Link from "next/link"
import { CalendarDays, Users, Ticket, DollarSign } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"

export default async function AdminDashboard() {
  await requireAdmin()
  const supabase = await createClient()

  const [{ count: eventsCount }, { count: editionsCount }, { data: registrations }] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("editions").select("*", { count: "exact", head: true }),
    supabase.from("registrations").select("amount_cents, status"),
  ])

  const paid = (registrations ?? []).filter((r) => r.status === "paid")
  const revenueCents = paid.reduce((sum, r) => sum + (r.amount_cents ?? 0), 0)

  const stats = [
    { label: "Eventos", value: eventsCount ?? 0, icon: CalendarDays },
    { label: "Turmas", value: editionsCount ?? 0, icon: Ticket },
    { label: "Inscrições pagas", value: paid.length, icon: Users },
    { label: "Receita confirmada", value: formatPrice(revenueCents), icon: DollarSign },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Visão geral</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acompanhe eventos, turmas e inscrições.</p>
        </div>
        <Link href="/admin/eventos/novo" className={buttonVariants()}>
          Novo evento
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ações rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/admin/eventos" className={buttonVariants({ variant: "outline" })}>
            Gerenciar eventos
          </Link>
          <Link href="/admin/inscricoes" className={buttonVariants({ variant: "outline" })}>
            Ver inscrições
          </Link>
          <Link href="/admin/conteudo" className={buttonVariants({ variant: "outline" })}>
            Editar conteúdo do site
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
