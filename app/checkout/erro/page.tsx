import type { Metadata } from "next"
import { CheckoutResult } from "@/components/raizes/checkout-result"

export const metadata: Metadata = {
  title: "Pagamento não concluído | Raízes e Ritmos",
  robots: { index: false },
}

export default function CheckoutErrorPage() {
  return <CheckoutResult variant="erro" />
}
