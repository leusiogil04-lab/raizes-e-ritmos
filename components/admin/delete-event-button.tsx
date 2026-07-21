"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteEvent } from "@/app/admin/eventos/actions"

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
      disabled={loading}
      onClick={async () => {
        if (confirm("Excluir este evento e todas as suas turmas? Esta ação não pode ser desfeita.")) {
          setLoading(true)
          await deleteEvent(eventId)
        }
      }}
    >
      <Trash2 className="size-4" />
      Excluir evento
    </Button>
  )
}
