"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTestimonial, deleteTestimonial } from "@/app/admin/conteudo/actions"
import type { Testimonial } from "@/lib/types"

type ActionResult = { error?: string; success?: boolean }

function AddButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Adicionando..." : "Adicionar depoimento"}
    </Button>
  )
}

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const [state, formAction] = useActionState(createTestimonial, {} as ActionResult)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    else if (state?.success) {
      toast.success("Depoimento adicionado")
      formRef.current?.reset()
    }
  }, [state])

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-3">
        {testimonials.map((t) => (
          <li key={t.id} className="flex items-start justify-between gap-4 rounded-md border border-border p-4">
            <div>
              <p className="text-sm text-foreground">{`"${t.quote}"`}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.author}
                {t.role ? ` — ${t.role}` : ""}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={async () => {
                if (confirm("Excluir este depoimento?")) {
                  await deleteTestimonial(t.id)
                  toast.success("Depoimento excluído")
                }
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
        {testimonials.length === 0 && <p className="text-sm text-muted-foreground">Nenhum depoimento cadastrado.</p>}
      </ul>

      <form ref={formRef} action={formAction} className="flex flex-col gap-4 rounded-md border border-dashed border-border p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="t_author">Autor</Label>
            <Input id="t_author" name="author" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="t_role">Função / contexto</Label>
            <Input id="t_role" name="role" placeholder="Participante" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="t_quote">Depoimento</Label>
          <Textarea id="t_quote" name="quote" rows={2} required />
        </div>
        <input type="hidden" name="sort_order" value={testimonials.length + 1} />
        <div>
          <AddButton />
        </div>
      </form>
    </div>
  )
}
