import { Hero } from "@/components/marketing/hero"
import { Occasions } from "@/components/marketing/occasions"
import { FeaturedBoxes } from "@/components/marketing/featured-boxes"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Testimonials } from "@/components/marketing/testimonials"
import { FinalCta } from "@/components/marketing/final-cta"

/**
 * Landing page — Modern Premium Minimalist.
 * Hero leads; sections use shared fade-up motion with reduced-motion support.
 */
export default function HomePage() {
  return (
    <div className="bg-slate-50 dark:bg-zinc-950">
      <Hero />
      <Occasions />
      <FeaturedBoxes />
      <HowItWorks />
      <Testimonials />
      <FinalCta />
    </div>
  )
}
