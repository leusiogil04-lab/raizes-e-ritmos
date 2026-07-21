"use client"

import { useState, useEffect } from "react"
import { X, Loader2, MessageCircle } from "lucide-react"
import type { Edition } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { track } from "@/lib/analytics"

interface CheckoutButtonProps {
  edition: Edition
  eventSlug: string
  eventTitle: string
  whatsapp: string
  className?: string
  label: string
}

/**
 * Botão + modal de inscrição.
 * Coleta os dados do participante, chama /api/checkout e redireciona
 * para o Mercado Pago. Se o pagamento online ainda não estiver ativo,
 * oferece a inscrição via WhatsApp como alternativa.
 */
export function CheckoutButton({
  edition,
  eventSlug,
  eventTitle,
  whatsapp,
  className,
  label,
}: CheckoutButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallback, setFallback] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", quantity: 1 })

  // Bloqueia o scroll do body enquanto o modal está aberto
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  function openModal() {
    track("click_checkout", {
      eventSlug,
      editionId: edition.id,
      status: edition.status,
      amount: edition.price_cents,
    })
    setError(null)
    setFallback(false)
    setOpen(true)
  }

  const whatsappFallbackUrl = (() => {
    const base = whatsapp || "https://wa.me/"
    const msg = encodeURIComponent(
      `Olá! Tenho interesse na inscrição para "${eventTitle}"${
        edition.title ? ` (${edition.title})` : ""
      }.`,
    )
    return base.includes("?") ? `${base}&text=${msg}` : `${base}?text=${msg}`
  })()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editionId: edition.id,
          buyerName: form.name,
          buyerEmail: form.email,
          buyerPhone: form.phone,
          quantity: form.quantity,
        }),
      })
      const data = await res.json()

      if (res.ok && data.url) {
        track("checkout_redirect", { editionId: edition.id })
        window.location.href = data.url
        return
      }

      // Pagamento online ainda não configurado -> oferece WhatsApp
      if (res.status === 503) {
        setFallback(true)
        setError(
          "O pagamento online ainda está sendo ativado. Você pode garantir sua vaga pelo WhatsApp.",
        )
        return
      }

      setError(data.error ?? "Não foi possível iniciar o pagamento.")
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button type="button" onClick={openModal} className={className}>
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-wine/60 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) setOpen(false)
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-cream shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-wine/10 p-6">
              <div>
                <h2 id="checkout-title" className="font-serif text-2xl font-semibold text-wine">
                  Garantir vaga
                </h2>
                <p className="mt-1 text-sm text-wine/70">
                  {eventTitle}
                  {edition.title ? ` — ${edition.title}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !loading && setOpen(false)}
                aria-label="Fechar"
                className="rounded-full p-1.5 text-wine/60 transition-colors hover:bg-wine/10 hover:text-wine"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label htmlFor="ck-name" className="mb-1.5 block text-sm font-medium text-wine">
                  Nome completo
                </label>
                <input
                  id="ck-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-wine/20 bg-white px-4 py-2.5 text-wine outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label htmlFor="ck-email" className="mb-1.5 block text-sm font-medium text-wine">
                  E-mail
                </label>
                <input
                  id="ck-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-wine/20 bg-white px-4 py-2.5 text-wine outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ck-phone" className="mb-1.5 block text-sm font-medium text-wine">
                    WhatsApp
                  </label>
                  <input
                    id="ck-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-wine/20 bg-white px-4 py-2.5 text-wine outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label htmlFor="ck-qty" className="mb-1.5 block text-sm font-medium text-wine">
                    Vagas
                  </label>
                  <input
                    id="ck-qty"
                    type="number"
                    min={1}
                    max={10}
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: Math.max(1, Number(e.target.value) || 1) })
                    }
                    className="w-full rounded-xl border border-wine/20 bg-white px-4 py-2.5 text-wine outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-wine/5 px-4 py-3">
                <span className="text-sm text-wine/70">Total</span>
                <span className="font-serif text-2xl font-semibold text-wine">
                  {formatPrice(edition.price_cents * form.quantity, edition.currency)}
                </span>
              </div>

              {error && (
                <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-wine" role="alert">
                  {error}
                </p>
              )}

              {fallback ? (
                <a
                  href={whatsappFallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-wine"
                >
                  <MessageCircle className="size-4" />
                  Inscrever pelo WhatsApp
                </a>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-wine disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Ir para o pagamento"
                  )}
                </button>
              )}

              <p className="text-center text-xs text-wine/50">
                Pagamento processado com segurança pelo Mercado Pago.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
