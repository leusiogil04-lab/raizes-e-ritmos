"use client"

import { useEffect } from "react"
import { track } from "@/lib/analytics"

/** Dispara o evento page_view ao carregar a página. */
export function PageTracker() {
  useEffect(() => {
    track("page_view", { page: "home" })
  }, [])
  return null
}
