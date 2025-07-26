import { Heart, Github, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-taupe-200/50 to-transparent px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center items-center gap-6 mb-8">
          <a
            href="#"
            className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-sage-100 transition-colors duration-300 shadow-md"
          >
            <Github className="w-5 h-5 text-sage-600" />
          </a>
          <a
            href="#"
            className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-sage-100 transition-colors duration-300 shadow-md"
          >
            <Twitter className="w-5 h-5 text-sage-600" />
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-8 text-warmGray font-serif">
          <a href="#" className="hover:text-sage-600 transition-colors duration-300">
            Features
          </a>
          <a href="#" className="hover:text-sage-600 transition-colors duration-300">
            Demo
          </a>
          <a href="#" className="hover:text-sage-600 transition-colors duration-300">
            GitHub
          </a>
          <a href="#" className="hover:text-sage-600 transition-colors duration-300">
            Support
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 text-warmGray font-serif mb-4">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-rose-400 fill-current" />
          
        </div>

        <p className="text-warmGray/70 text-sm font-serif">
          © 2024 The Story Nook. Crafted for storytellers everywhere.
        </p>
      </div>
    </footer>
  )
}
