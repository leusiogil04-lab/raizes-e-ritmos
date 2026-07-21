import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { LogoutButton } from "@/components/admin/logout-button"

export default function NaoAutorizadoPage() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md text-center">
        <p className="font-serif text-3xl text-foreground text-balance">Acesso restrito</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Sua conta não tem permissão de administrador. Se você deveria ter acesso, peça para um administrador
          atualizar seu perfil.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Voltar ao site
          </Link>
          <LogoutButton />
        </div>
      </div>
    </main>
  )
}
