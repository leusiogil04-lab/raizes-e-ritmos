"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import Image from "next/image"
import { projectConfig } from "@/lib/site-config"

const links = [
  { label: "Experiência", href: "#experiencia" },
  { label: "Oficinas", href: "#eventos" },
  { label: "Leusio Gil", href: "#leusio" },
  { label: "Cultura", href: "#cultura" },
  { label: "Dúvidas", href: "#faq" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-wine/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

        {/* LOGO */}
        <a href="#top" className="flex items-center">
          <Image
            src="images/raizes.png"
            alt="Logo Raízes"
            width={120}
            height={120}
            className="h-16 w-auto object-contain md:h-20"
            priority
          />
        </a>

        <nav 
          className="hidden items-center gap-8 md:flex" 
          aria-label="Navegação principal"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cream/80 transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#eventos"
          className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-wine transition-transform hover:scale-105 md:inline-block"
        >
          Garantir vaga
        </a>

      </div>
    </motion.header>
  )
}