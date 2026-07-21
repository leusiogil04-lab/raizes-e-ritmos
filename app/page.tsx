import { SiteHeader } from "@/components/raizes/site-header"
import { Hero } from "@/components/raizes/hero"
import { Experience } from "@/components/raizes/experience"
import { Events } from "@/components/raizes/events"
import { Methodology } from "@/components/raizes/methodology"
import { Instructor } from "@/components/raizes/instructor"
import { Culture } from "@/components/raizes/culture"
import { PastEvents } from "@/components/raizes/past-events"
import { Testimonials } from "@/components/raizes/testimonials"
import { Faq } from "@/components/raizes/faq"
import { FinalCta } from "@/components/raizes/final-cta"
import { SiteFooter } from "@/components/raizes/site-footer"
import { MobileCta } from "@/components/raizes/mobile-cta"
import { PageTracker } from "@/components/raizes/page-tracker"
import {
  getEventsWithEditions,
  getTestimonials,
  getFaqs,
  getSiteSettings,
} from "@/lib/data"

export const revalidate = 60

export default async function Page() {
  const [events, testimonials, faqs, settings] = await Promise.all([
    getEventsWithEditions(),
    getTestimonials(),
    getFaqs(),
    getSiteSettings(),
  ])

  return (
    <>
      <PageTracker />
      <SiteHeader />
      <main>
        <Hero />
        <Experience />
        <Events events={events} />
        <Methodology />
        <Instructor instructor={settings.instructor} instagram={settings.contact.instagram} />
        <Culture />
        <PastEvents />
        <Testimonials testimonials={testimonials} />
        <Faq faqs={faqs} />
        <FinalCta />
      </main>
      <SiteFooter contact={settings.contact} />
      <MobileCta whatsapp={settings.contact.whatsapp} />
    </>
  )
}
