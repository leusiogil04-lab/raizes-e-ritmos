import type { Metadata } from "next"
import { CheckoutResult } from "@/components/raizes/checkout-result"

export const metadata: Metadata = {
  title: "Inscrição confirmada | Raízes e Ritmos",
  robots: { index: false },
}

export default function CheckoutSuccessPage() {
  return <CheckoutResult variant="sucesso" />
}
