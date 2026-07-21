/**
 * Resolve a URL base pública do site para montar os links de retorno
 * do Mercado Pago (success/failure/pending) e o webhook.
 *
 * Ordem de prioridade:
 *  1. NEXT_PUBLIC_SITE_URL  -> defina com seu domínio final (ex: https://raizeseritmos.com)
 *  2. VERCEL_URL            -> domínio automático do deploy (fallback)
 *  3. localhost             -> desenvolvimento
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")

  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`

  return "http://localhost:3000"
}
