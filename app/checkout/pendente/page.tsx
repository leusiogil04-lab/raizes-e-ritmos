import type { Metadata } from "next"
import { CheckoutResult } from "@/components/raizes/checkout-result"

export const metadata: Metadata = {
  title: "Pagamento em processamento | Raízes e Ritmos",
  robots: { index: false },
}

export default function CheckoutPendingPage() {
  return <CheckoutResult variant="pendente" />
}
