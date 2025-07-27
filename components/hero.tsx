import { Button } from "@/components/ui/button"
import { Feather, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative px-6 py-20 md:py-32 text-center">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <Feather className="w-8 h-8 text-sage-400 transform rotate-12" />
      </div>
      <div className="absolute top-20 right-16 opacity-20">
        <BookOpen className="w-6 h-6 text-rose-400 transform -rotate-12" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-20">
        <Sparkles className="w-7 h-7 text-peach-400" />
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif text-softBrown mb-6 leading-tight">
          Welcome to your
          <span className="block text-sage-600 italic">Story Room</span>
        </h1>

        <p className="text-xl md:text-2xl text-warmGray mb-12 max-w-2xl mx-auto leading-relaxed font-serif">
          Create worlds, characters, and stories with the gentle guidance of AI
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/start-writing">
            <Button
              size="lg"
              className="bg-sage-500 hover:bg-sage-600 text-white px-8 py-4 rounded-full text-lg font-serif shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Writing
            </Button>
          </Link>
          
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-full text-lg font-serif transition-all duration-300 bg-transparent"
          >
            View Demo
          </Button>
        </div>
      </div>

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 pointer-events-none" />
    </section>
  )
}
