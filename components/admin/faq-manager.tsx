"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createFaq, deleteFaq } from "@/app/admin/conteudo/actions"
import type { Faq } from "@/lib/types"

type ActionResult = { error?: string; success?: boolean }

function AddButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Adicionando..." : "Adicionar pergunta"}
    </Button>
  )
}

export function FaqManager({ faqs }: { faqs: Faq[] }) {
  const [state, formAction] = useActionState(createFaq, {} as ActionResult)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    else if (state?.success) {
      toast.success("Pergunta adicionada")
      formRef.current?.reset()
    }
  }, [state])

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-3">
        {faqs.map((f) => (
          <li key={f.id} className="flex items-start justify-between gap-4 rounded-md border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">{f.question}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={async () => {
                if (confirm("Excluir esta pergunta?")) {
                  await deleteFaq(f.id)
                  toast.success("Pergunta excluída")
                }
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
        {faqs.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma pergunta cadastrada.</p>}
      </ul>

      <form ref={formRef} action={formAction} className="flex flex-col gap-4 rounded-md border border-dashed border-border p-4">
        <div className="grid gap-2">
          <Label htmlFor="f_question">Pergunta</Label>
          <Input id="f_question" name="question" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="f_answer">Resposta</Label>
          <Textarea id="f_answer" name="answer" rows={2} required />
        </div>
        <input type="hidden" name="sort_order" value={faqs.length + 1} />
        <div>
          <AddButton />
        </div>
      </form>
    </div>
  )
}
