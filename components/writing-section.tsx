import { Heart, Coffee, Moon } from "lucide-react"

export default function WritingSection() {
  return (
    <section className="px-6 py-20 bg-gradient-to-r from-white/60 to-cream-100/40">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Girl writing story image */}
        <div className="relative order-2 lg:order-1">
          <div className="bg-gradient-to-br from-rose-100 to-peach-100 rounded-3xl p-8 shadow-2xl">
            <img
              src="/placeholder.svg?height=450&width=500"
              alt="Young woman writing stories in a cozy, warm environment"
              className="w-full h-auto rounded-2xl"
            />
          </div>

          {/* Floating cozy elements */}
          <div className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-lg">
            <Coffee className="w-6 h-6 text-peach-500" />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-full shadow-lg">
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
          <div className="absolute top-1/2 -left-6 bg-white p-2 rounded-full shadow-md">
            <Moon className="w-4 h-4 text-sage-500" />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="order-1 lg:order-2">
          <h2 className="text-4xl md:text-5xl font-serif text-softBrown mb-6 leading-tight">
            Your Creative
            <span className="block text-sage-600 italic">Sanctuary</span>
          </h2>

          <p className="text-lg text-warmGray mb-8 leading-relaxed font-serif">
            Step into a world where creativity flows freely. Our AI companions understand the delicate art of
            storytelling, offering gentle guidance while preserving your unique voice.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-sage-400 rounded-full mt-3"></div>
              <div>
                <h3 className="font-serif font-semibold text-softBrown mb-1">Intuitive Character Building</h3>
                <p className="text-warmGray font-serif">Breathe life into characters with depth and authenticity</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-rose-400 rounded-full mt-3"></div>
              <div>
                <h3 className="font-serif font-semibold text-softBrown mb-1">Immersive World Creation</h3>
                <p className="text-warmGray font-serif">Craft worlds that feel lived-in and believable</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-peach-400 rounded-full mt-3"></div>
              <div>
                <h3 className="font-serif font-semibold text-softBrown mb-1">Gentle Writing Guidance</h3>
                <p className="text-warmGray font-serif">Overcome blocks with thoughtful, inspiring suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
