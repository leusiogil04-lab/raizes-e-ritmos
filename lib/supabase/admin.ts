import { createClient } from "@supabase/supabase-js"

/**
 * Client Supabase com service role — USO EXCLUSIVO NO SERVIDOR.
 * Ignora RLS. Usado pelo webhook do Mercado Pago e pelo checkout
 * para registrar/atualizar inscrições sem sessão de usuário.
 *
 * NUNCA importe este arquivo em componentes de cliente.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRole) {
    throw new Error("Supabase admin: variáveis de ambiente ausentes (URL / SERVICE_ROLE_KEY).")
  }

  return createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
