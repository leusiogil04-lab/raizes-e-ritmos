import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { getSiteSettings } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "@/components/admin/settings-form"
import { TestimonialsManager } from "@/components/admin/testimonials-manager"
import { FaqManager } from "@/components/admin/faq-manager"
import type { Faq, Testimonial } from "@/lib/types"

export default async function AdminContentPage() {
  await requireAdmin()
  const supabase = await createClient()

  const [settings, { data: testimonials }, { data: faqs }] = await Promise.all([
    getSiteSettings(),
    supabase.from("testimonials").select("*").order("sort_order", { ascending: true }),
    supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Conteúdo do site</h1>
        <p className="mt-1 text-sm text-muted-foreground">Edite textos, depoimentos e perguntas frequentes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm hero={settings.hero} instructor={settings.instructor} contact={settings.contact} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Depoimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialsManager testimonials={(testimonials ?? []) as Testimonial[]} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perguntas frequentes</CardTitle>
        </CardHeader>
        <CardContent>
          <FaqManager faqs={(faqs ?? []) as Faq[]} />
        </CardContent>
      </Card>
    </div>
  )
}
