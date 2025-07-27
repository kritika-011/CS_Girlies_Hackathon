
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function storySteps() {
  return (
    <section id="steps" className="bg-white py-20 px-6 border-y border-peach-100 text-softBrown">
      <div className="max-w-5xl mx-auto space-y-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
          Your dream story is just 4 steps away
        </h2>

        <Step
          number={1}
          title="Get the Idea"
          description="Start with a spark — a prompt, theme, or simple sentence. We'll help transform it into a compelling concept."
        />
        <Step
          number={2}
          title="Secure Your World"
          description="Define the setting — whether it's a magical kingdom, a dystopian city, or something entirely new."
        />
        <Step
          number={3}
          title="Meet Your Characters"
          description="Generate detailed, vivid characters with arcs, traits, flaws, and even images."
        />
        <Step
          number={4}
          title="Build Upon the Plot"
          description="Outline the major beats — goals, conflict, and turning points — to craft a strong narrative flow."
        />
      </div>
      <div  className="flex justify-center mt-10">
      <Link href="/write">
            <Button
              size="lg"
              className="bg-sage-500 hover:bg-sage-600 text-white px-8 py-4 rounded-full text-lg font-serif shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get started
            </Button>
      </Link>
      </div>
    </section>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-6">
      <div className="w-12 h-12 rounded-full bg-sage-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
        {number}
      </div>
      <div>
        <h3 className="text-2xl font-serif font-semibold">{title}</h3>
        <p className="text-warmGray mt-2">{description}</p>
      </div>
    </div>
  );
}
