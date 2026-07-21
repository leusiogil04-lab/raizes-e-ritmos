import type React from "react"
import Link from "next/link"
import { requireAdmin } from "@/lib/auth"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { Toaster } from "@/components/ui/sonner"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="min-h-svh bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:px-8">
        
        {/* Sidebar / Topbar responsiva */}
        <aside className="w-full lg:w-64 lg:shrink-0">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 shadow-sm lg:sticky lg:top-6 lg:gap-6 lg:p-5">
            
            {/* Cabeçalho do Painel */}
            <div className="flex items-center justify-between lg:block">
              <div>
                <Link
                  href="/"
                  className="whitespace-nowrap font-serif text-lg font-bold tracking-tight text-foreground transition-colors hover:text-primary"
                >
                  Raízes e Ritmos
                </Link>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Painel administrativo
                </p>
              </div>
            </div>

            {/* Menu de Navegação */}
            <div className="overflow-x-auto lg:overflow-visible">
              <AdminNav />
            </div>

            {/* Rodapé do Usuário */}
            <div className="mt-auto border-t border-border pt-4">
              <p className="mb-3 truncate text-xs font-medium text-muted-foreground" title={admin.email}>
                {admin.fullName || admin.email}
              </p>

              <LogoutButton className="w-full" />
            </div>

          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="min-w-0 flex-1 rounded-xl border border-border bg-background p-4 shadow-sm sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

      <Toaster />
    </div>
  )
}