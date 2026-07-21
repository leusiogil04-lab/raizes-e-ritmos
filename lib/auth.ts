import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type AdminSession = {
  userId: string
  email: string
  fullName: string | null
}

/**
 * Garante que há um usuário autenticado E com role 'admin'.
 * Deve ser chamada no topo de todas as páginas/ações do /admin.
 * - Sem sessão -> redireciona para /auth/login
 * - Sessão sem role admin -> redireciona para /auth/nao-autorizado
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/auth/nao-autorizado")
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: profile.full_name ?? null,
  }
}
