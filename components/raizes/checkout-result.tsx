import Link from "next/link"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { BackButton } from "@/components/raizes/back-button"

type Variant = "sucesso" | "pendente" | "erro"

const content: Record<
  Variant,
  { icon: typeof CheckCircle2; title: string; message: string; tone: string }
> = {
  sucesso: {
    icon: CheckCircle2,
    title: "Inscrição confirmada!",
    message:
      "Recebemos seu pagamento. Enviamos os detalhes para o seu e-mail. Nos vemos na vivência!",
    tone: "text-terracotta",
  },
  pendente: {
    icon: Clock,
    title: "Pagamento em processamento",
    message:
      "Seu pagamento está sendo confirmado. Assim que for aprovado, você receberá a confirmação por e-mail.",
    tone: "text-terracotta",
  },
  erro: {
    icon: XCircle,
    title: "Não foi possível concluir",
    message:
      "O pagamento não foi concluído. Nenhum valor foi cobrado. Você pode tentar novamente quando quiser.",
    tone: "text-wine",
  },
}

export function CheckoutResult({ variant }: { variant: Variant }) {
  const { icon: Icon, title, message, tone } = content[variant]

  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-5 py-20 text-wine">
      <div className="w-full max-w-md rounded-3xl border border-wine/10 bg-white p-8 text-center shadow-sm">
        <div className="mb-6 flex justify-start">
          <BackButton fallback="/eventos" tone="wine" />
        </div>
        <Icon className={`mx-auto size-16 ${tone}`} />
        <h1 className="mt-6 font-serif text-3xl font-semibold">{title}</h1>
        <p className="mt-3 text-pretty leading-relaxed text-wine/70">{message}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/eventos"
            className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-wine"
          >
            Ver experiências
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-wine/20 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-wine transition-colors hover:bg-wine/5"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  )
}
