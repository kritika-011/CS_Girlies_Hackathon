import Hero from "@/components/hero"
import WritingSection from "@/components/writing-section"
import Features from "@/components/features"
import Footer from "@/components/footer"
import StorySteps from "@/components/storySteps"
import Link from "next/link"


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-peach-50">
      {/* Navigation */}
      <nav className="px-6 py-6 bg-white/80 backdrop-blur-sm border-b border-rose-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">SN</span>
            </div>
            <span className="text-2xl font-serif font-bold text-softBrown">The Story Nook</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-warmGray hover:text-softBrown transition-colors font-serif">
              Features
            </a>
            <a href="#demo" className="text-warmGray hover:text-softBrown transition-colors font-serif">
              Demo
            </a>
            <Link href="/write">
              <button className="bg-sage-500 hover:bg-sage-600 text-white px-6 py-2 rounded-full font-serif transition-colors shadow-md">
                Start Writing
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <Hero />
      <WritingSection />
      <StorySteps />
      <Features />
      <Footer />
    </main>
  )
}
