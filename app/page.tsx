import { LandingHeader } from "@/components/landing/landing-header"
import { Hero } from "@/components/landing/hero"
import { HowItWorks, Features } from "@/components/landing/sections"
import { WorkflowShowcase, FinalCta, LandingFooter } from "@/components/landing/workflow-cta"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <Hero />
        <HowItWorks />
        <WorkflowShowcase />
        <Features />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}
