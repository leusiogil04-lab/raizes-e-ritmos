"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

/**
 * Botão "Voltar" reutilizável para subpáginas.
 * Usa o histórico do navegador; se não houver, cai no fallback (padrão "/").
 */
export function BackButton({
  fallback = "/",
  label = "Voltar",
  tone = "cream",
  className = "",
}: {
  fallback?: string
  label?: string
  tone?: "cream" | "wine"
  className?: string
}) {
  const router = useRouter()

  const tones = {
    cream:
      "border-cream/30 text-cream/90 hover:border-accent hover:text-accent",
    wine: "border-wine/20 text-wine hover:border-terracotta hover:text-terracotta",
  }

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${tones[tone]} ${className}`}
    >
      <ArrowLeft className="size-4" />
      {label}
    </button>
  )
}
