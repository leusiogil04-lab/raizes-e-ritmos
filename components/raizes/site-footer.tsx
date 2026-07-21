"use client"

import { MessageCircle, Mail } from "lucide-react"
import { projectConfig } from "@/lib/site-config"
import type { ContactSettings } from "@/lib/types"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

export function SiteFooter({ contact }: { contact: ContactSettings }) {
  return (
    <footer className="bg-wine py-16 text-cream">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
              {projectConfig.name}
            </p>
            <p className="mt-2 max-w-xs text-sm text-cream/70">
              {projectConfig.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-11 items-center justify-center rounded-full border border-cream/25 transition-colors hover:bg-accent hover:text-wine"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={contact.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex size-11 items-center justify-center rounded-full border border-cream/25 transition-colors hover:bg-accent hover:text-wine"
            >
              <YoutubeIcon className="size-5" />
            </a>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex size-11 items-center justify-center rounded-full border border-cream/25 transition-colors hover:bg-accent hover:text-wine"
            >
              <MessageCircle className="size-5" />
            </a>
            <a
              href={`mailto:${contact.email}`}
              aria-label="E-mail"
              className="flex size-11 items-center justify-center rounded-full border border-cream/25 transition-colors hover:bg-accent hover:text-wine"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-cream/15 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {projectConfig.name}. Todos os direitos
            reservados.
          </p>
          <div className="flex items-center gap-4">
            <p>Vivências musicais interculturais de Moçambique.</p>
            <a
              href="/admin"
              className="text-cream/50 underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Área administrativa
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
