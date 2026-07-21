import type { EditionStatus } from "./types"

/* ---------------------------------------------------------------------
 *  STATUS DAS TURMAS
 *  Cada status muda a aparência da etiqueta e o texto do botão.
 * ------------------------------------------------------------------- */
export interface StatusStyle {
  label: string
  cta: string
  actionable: boolean
  tone: "open" | "warning" | "closed" | "soon"
}

export const statusConfig: Record<EditionStatus, StatusStyle> = {
  inscricoes_abertas: {
    label: "Inscrições abertas",
    cta: "Garantir minha vaga",
    actionable: true,
    tone: "open",
  },
  ultimas_vagas: {
    label: "Últimas vagas",
    cta: "Garantir minha vaga",
    actionable: true,
    tone: "warning",
  },
  esgotado: {
    label: "Esgotado",
    cta: "Lista de espera",
    actionable: false,
    tone: "closed",
  },
  encerrado: {
    label: "Encerrado",
    cta: "Ver próximas turmas",
    actionable: false,
    tone: "closed",
  },
  em_breve: {
    label: "Em breve",
    cta: "Avise-me",
    actionable: false,
    tone: "soon",
  },
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function formatPrice(cents: number, currency = "BRL"): string {
  if (currency !== "BRL") {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(
      cents / 100,
    )
  }
  return brl.format(cents / 100)
}

export function formatDate(iso: string | null): string {
  if (!iso) return ""
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
}

export function formatDateShort(iso: string | null): string {
  if (!iso) return ""
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(iso))
}

export function formatTime(iso: string | null): string {
  if (!iso) return ""
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

export function seatsLeft(capacity: number, taken: number): number {
  return Math.max(0, capacity - taken)
}

export const audienceLabels: Record<string, string> = {
  todos: "Todos",
  adultos: "Adultos",
  criancas: "Crianças",
  familias: "Famílias",
  empresas: "Empresas",
}
