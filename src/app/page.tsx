import { Hero } from "@/components/marketing/hero"
import { Occasions } from "@/components/marketing/occasions"
import { FeaturedBoxes } from "@/components/marketing/featured-boxes"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Testimonials } from "@/components/marketing/testimonials"
import { FinalCta } from "@/components/marketing/final-cta"

/**
 * Landing page — Modern Premium Minimalist.
 * Hero (Step 2) leads; remaining sections will be toned in later polish passes.
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
