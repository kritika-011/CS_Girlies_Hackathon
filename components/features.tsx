// import { Card, CardContent } from "@/components/ui/card"
// import { Users, Globe, PenTool } from "lucide-react"

// const features = [
//   {
//     icon: Users,
//     title: "Character Generator",
//     description:
//       "Create complex, believable characters with detailed backstories, motivations, and unique traits that drive compelling narratives.",
//   },
//   {
//     icon: Globe,
//     title: "World Builder",
//     description:
//       "Design rich, immersive worlds with consistent cultures, histories, and landscapes that serve as perfect story backdrops.",
//   },
//   {
//     icon: PenTool,
//     title: "AI Writing Assistant",
//     description:
//       "Break through writer's block with intelligent suggestions and gentle guidance that enhances your natural storytelling voice.",
//   },
// ]

// export default function Features() {
//   return (
//     <section id="features" className="px-6 py-20 bg-gradient-to-b from-transparent to-cream-100/30">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-serif text-softBrown mb-4">Your Creative Companions</h2>
//           <p className="text-xl text-warmGray max-w-2xl mx-auto font-serif leading-relaxed">
//             Gentle AI tools designed to inspire and support your storytelling journey
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <Card
//               key={index}
//               className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
//             >
//               <CardContent className="p-8 text-center">
//                 <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-sage-200 to-peach-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                   <feature.icon className="w-8 h-8 text-sage-600" />
//                 </div>

//                 <h3 className="text-2xl font-serif font-semibold text-softBrown mb-4">{feature.title}</h3>

//                 <p className="text-warmGray leading-relaxed font-serif">{feature.description}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }


import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Globe, PenTool } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Character Generator",
    link: "/character-maker",
    description:
      "Create complex, believable characters with detailed backstories, motivations, and unique traits that drive compelling narratives.",
  },
  {
    icon: Globe,
    title: "World Builder",
    link: "/world-maker",
    description:
      "Design rich, immersive worlds with consistent cultures, histories, and landscapes that serve as perfect story backdrops.",
  },
  {
    icon: PenTool,
    title: "AI Writing Assistant",
    link: "/write",
    description:
      "Break through writer's block with intelligent suggestions and gentle guidance that enhances your natural storytelling voice.",
  },
]

export default function Features() {
  return (
    <section id="features" className="px-6 py-20 bg-gradient-to-b from-transparent to-cream-100/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-softBrown mb-4">Your Creative Companions</h2>
          <p className="text-xl text-warmGray max-w-2xl mx-auto font-serif leading-relaxed">
            Gentle AI tools designed to inspire and support your storytelling journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link}>
              <Card className="cursor-pointer bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group hover:scale-[1.02]">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-sage-200 to-peach-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-sage-600" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-softBrown mb-4">{feature.title}</h3>
                  <p className="text-warmGray leading-relaxed font-serif">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
