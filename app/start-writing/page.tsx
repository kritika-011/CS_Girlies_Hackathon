import { Button } from "@/components/ui/button"
import { LayoutDashboard, PenTool, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function StartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-peach-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">SN</span>
            </div>
            <span className="text-2xl font-serif font-bold text-softBrown">The Story Nook</span>
          </Link>

          <Link href="/">
            <Button variant="ghost" className="text-warmGray hover:text-softBrown font-serif">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-softBrown mb-6 leading-tight">
            Choose Your
            <span className="block text-sage-600 italic">Creative Path</span>
          </h1>
          <p className="text-xl text-warmGray font-serif leading-relaxed max-w-2xl mx-auto">
            Select how you'd like to begin your writing journey today.
          </p>
        </div>

        {/* Main Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Dashboard Button */}
          <Link href="/dashboard">
            <button className="w-full bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-8 text-center group cursor-pointer border-2 border-transparent hover:border-sage-200">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-sage-200 to-sage-300 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard className="w-10 h-10 text-sage-600" />
              </div>

              <h2 className="text-3xl font-serif font-semibold text-softBrown mb-4">Dashboard</h2>

              <p className="text-warmGray font-serif leading-relaxed mb-6">
                Organize your stories, track progress, and manage all your creative projects in one place.
              </p>

              <div className="bg-sage-500 group-hover:bg-sage-600 text-white px-8 py-3 rounded-full font-serif shadow-md group-hover:shadow-lg transition-all duration-300 inline-flex items-center">
                Dashboard
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </Link>

          {/* Writer Button */}
          <Link href="/write">
            <button className="w-full bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-8 text-center group cursor-pointer border-2 border-transparent hover:border-rose-200">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-peach-200 to-rose-300 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <PenTool className="w-10 h-10 text-rose-600" />
              </div>

              <h2 className="text-3xl font-serif font-semibold text-softBrown mb-4">Writer</h2>

              <p className="text-warmGray font-serif leading-relaxed mb-6">
                Jump straight into your writing flow with our AI-powered writing tools and distraction-free editor.
              </p>

              <div className="bg-rose-500 group-hover:bg-rose-600 text-white px-8 py-3 rounded-full font-serif shadow-md group-hover:shadow-lg transition-all duration-300 inline-flex items-center">
                Writer
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </Link>
        </div>

        {/* Note */}
        <div className="text-center mt-12">
          <p className="text-warmGray font-serif text-sm">
            Choose your preferred way to begin creating amazing stories.
          </p>
        </div>
      </div>
    </div>
  )
}
