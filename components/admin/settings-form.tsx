"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { updateSettings } from "@/app/admin/conteudo/actions"

import type {
  HeroSettings,
  InstructorSettings,
  ContactSettings,
} from "@/lib/types"

type ActionResult = {
  error?: string
  success?: boolean
}

function SaveButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Salvar configurações"}
    </Button>
  )
}

export function SettingsForm({
  hero,
  instructor,
  contact,
}: {
  hero: HeroSettings
  instructor: InstructorSettings
  contact: ContactSettings
}) {
  const [state, formAction] = useActionState(
    updateSettings,
    {} as ActionResult
  )

  // ============================================================
  // ESTADO LOCAL DO FORMULÁRIO
  // ============================================================

  const [heroData, setHeroData] = useState({
    eyebrow: hero?.eyebrow ?? "",
    cta_label: hero?.cta_label ?? "",
    title: hero?.title ?? "",
    subtitle: hero?.subtitle ?? "",
    cta_href: hero?.cta_href ?? "",
    image: hero?.image ?? "",
  })

  const [instructorData, setInstructorData] = useState({
    name: instructor?.name ?? "",
    role: instructor?.role ?? "",
    bio: instructor?.bio ?? "",
    image: instructor?.image ?? "",
  })

  const [contactData, setContactData] = useState({
    whatsapp: contact?.whatsapp ?? "",
    email: contact?.email ?? "",
    instagram: contact?.instagram ?? "",
    youtube: contact?.youtube ?? "",
  })

  // ============================================================
  // ATUALIZA OS CAMPOS CASO OS DADOS DO SUPABASE MUDEM
  // ============================================================

  useEffect(() => {
    setHeroData({
      eyebrow: hero?.eyebrow ?? "",
      cta_label: hero?.cta_label ?? "",
      title: hero?.title ?? "",
      subtitle: hero?.subtitle ?? "",
      cta_href: hero?.cta_href ?? "",
      image: hero?.image ?? "",
    })
  }, [
    hero?.eyebrow,
    hero?.cta_label,
    hero?.title,
    hero?.subtitle,
    hero?.cta_href,
    hero?.image,
  ])

  useEffect(() => {
    setInstructorData({
      name: instructor?.name ?? "",
      role: instructor?.role ?? "",
      bio: instructor?.bio ?? "",
      image: instructor?.image ?? "",
    })
  }, [
    instructor?.name,
    instructor?.role,
    instructor?.bio,
    instructor?.image,
  ])

  useEffect(() => {
    setContactData({
      whatsapp: contact?.whatsapp ?? "",
      email: contact?.email ?? "",
      instagram: contact?.instagram ?? "",
      youtube: contact?.youtube ?? "",
    })
  }, [
    contact?.whatsapp,
    contact?.email,
    contact?.instagram,
    contact?.youtube,
  ])

  // ============================================================
  // MENSAGENS DE SUCESSO / ERRO
  // ============================================================

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }

    if (state?.success) {
      toast.success("Configurações salvas")
    }
  }, [state])

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <form action={formAction} className="flex flex-col gap-8">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="flex flex-col gap-4">

        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Seção principal (Hero)
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">

          {/* Texto de apoio */}

          <div className="grid gap-2">

            <Label htmlFor="hero_eyebrow">
              Texto de apoio
            </Label>

            <Input
              id="hero_eyebrow"
              name="hero_eyebrow"
              value={heroData.eyebrow}
              onChange={(event) =>
                setHeroData((previous) => ({
                  ...previous,
                  eyebrow: event.target.value,
                }))
              }
            />

          </div>

          {/* Texto do botão */}

          <div className="grid gap-2">

            <Label htmlFor="hero_cta_label">
              Texto do botão
            </Label>

            <Input
              id="hero_cta_label"
              name="hero_cta_label"
              value={heroData.cta_label}
              onChange={(event) =>
                setHeroData((previous) => ({
                  ...previous,
                  cta_label: event.target.value,
                }))
              }
            />

          </div>

          {/* Título */}

          <div className="grid gap-2 sm:col-span-2">

            <Label htmlFor="hero_title">
              Título
            </Label>

            <Input
              id="hero_title"
              name="hero_title"
              value={heroData.title}
              onChange={(event) =>
                setHeroData((previous) => ({
                  ...previous,
                  title: event.target.value,
                }))
              }
            />

          </div>

          {/* Subtítulo */}

          <div className="grid gap-2 sm:col-span-2">

            <Label htmlFor="hero_subtitle">
              Subtítulo
            </Label>

            <Textarea
              id="hero_subtitle"
              name="hero_subtitle"
              value={heroData.subtitle}
              onChange={(event) =>
                setHeroData((previous) => ({
                  ...previous,
                  subtitle: event.target.value,
                }))
              }
              rows={2}
            />

          </div>

          {/* Link do botão */}

          <div className="grid gap-2">

            <Label htmlFor="hero_cta_href">
              Link do botão
            </Label>

            <Input
              id="hero_cta_href"
              name="hero_cta_href"
              value={heroData.cta_href}
              onChange={(event) =>
                setHeroData((previous) => ({
                  ...previous,
                  cta_href: event.target.value,
                }))
              }
            />

          </div>

          {/* Imagem */}

          <div className="grid gap-2">

            <Label htmlFor="hero_image">
              Imagem (URL)
            </Label>

            <Input
              id="hero_image"
              name="hero_image"
              value={heroData.image}
              onChange={(event) =>
                setHeroData((previous) => ({
                  ...previous,
                  image: event.target.value,
                }))
              }
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* FACILITADOR */}
      {/* ====================================================== */}

      <section className="flex flex-col gap-4">

        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Facilitador
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">

          {/* Nome */}

          <div className="grid gap-2">

            <Label htmlFor="instructor_name">
              Nome
            </Label>

            <Input
              id="instructor_name"
              name="instructor_name"
              value={instructorData.name}
              onChange={(event) =>
                setInstructorData((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
            />

          </div>

          {/* Função */}

          <div className="grid gap-2">

            <Label htmlFor="instructor_role">
              Função
            </Label>

            <Input
              id="instructor_role"
              name="instructor_role"
              value={instructorData.role}
              onChange={(event) =>
                setInstructorData((previous) => ({
                  ...previous,
                  role: event.target.value,
                }))
              }
            />

          </div>

          {/* Biografia */}

          <div className="grid gap-2 sm:col-span-2">

            <Label htmlFor="instructor_bio">
              Biografia
            </Label>

            <Textarea
              id="instructor_bio"
              name="instructor_bio"
              value={instructorData.bio}
              onChange={(event) =>
                setInstructorData((previous) => ({
                  ...previous,
                  bio: event.target.value,
                }))
              }
              rows={4}
            />

          </div>

          {/* Imagem */}

          <div className="grid gap-2 sm:col-span-2">

            <Label htmlFor="instructor_image">
              Imagem (URL)
            </Label>

            <Input
              id="instructor_image"
              name="instructor_image"
              value={instructorData.image}
              onChange={(event) =>
                setInstructorData((previous) => ({
                  ...previous,
                  image: event.target.value,
                }))
              }
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* CONTATO */}
      {/* ====================================================== */}

      <section className="flex flex-col gap-4">

        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Contato e redes
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">

          {/* WhatsApp */}

          <div className="grid gap-2">

            <Label htmlFor="contact_whatsapp">
              WhatsApp (link)
            </Label>

            <Input
              id="contact_whatsapp"
              name="contact_whatsapp"
              value={contactData.whatsapp}
              onChange={(event) =>
                setContactData((previous) => ({
                  ...previous,
                  whatsapp: event.target.value,
                }))
              }
            />

          </div>

          {/* E-mail */}

          <div className="grid gap-2">

            <Label htmlFor="contact_email">
              E-mail
            </Label>

            <Input
              id="contact_email"
              name="contact_email"
              value={contactData.email}
              onChange={(event) =>
                setContactData((previous) => ({
                  ...previous,
                  email: event.target.value,
                }))
              }
            />

          </div>

          {/* Instagram */}

          <div className="grid gap-2">

            <Label htmlFor="contact_instagram">
              Instagram (link)
            </Label>

            <Input
              id="contact_instagram"
              name="contact_instagram"
              value={contactData.instagram}
              onChange={(event) =>
                setContactData((previous) => ({
                  ...previous,
                  instagram: event.target.value,
                }))
              }
            />

          </div>

          {/* YouTube */}

          <div className="grid gap-2">

            <Label htmlFor="contact_youtube">
              YouTube (link)
            </Label>

            <Input
              id="contact_youtube"
              name="contact_youtube"
              value={contactData.youtube}
              onChange={(event) =>
                setContactData((previous) => ({
                  ...previous,
                  youtube: event.target.value,
                }))
              }
            />

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* SALVAR */}
      {/* ====================================================== */}

      <div>
        <SaveButton />
      </div>

    </form>
  )
}