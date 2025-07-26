"use client";

import { JSX, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@radix-ui/themes";
import { Button } from "@radix-ui/themes";

export default function WorldGenerator(): JSX.Element {
  const [apiKey, setApiKey] = useState<string>("");
  const [hfApiKey, setHfApiKey] = useState<string>("");
  const [worldIdea, setWorldIdea] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resultHtml, setResultHtml] = useState<string | null>(null);

  const generateWorld = async (): Promise<void> => {
    if (!apiKey || !hfApiKey || !worldIdea) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setResultHtml(null);

    // replace this with actual logic for Gemini + HF call
    setTimeout(() => {
      const dummy = `
        <h1 class='text-3xl font-bold mb-4'>${worldIdea}</h1>
        <p>Your world is being generated with API keys securely handled on the server.</p>
      `;
      setResultHtml(dummy);
      setLoading(false);
    }, 2000);
  };

  return (
    <section className="px-6 py-20 max-w-4xl mx-auto font-serif text-softBrown bg-gradient-to-b from-transparent to-cream-100/30">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-softBrown mb-4">World Builder</h1>
        <p className="text-xl text-warmGray max-w-2xl mx-auto leading-relaxed">
          Transform vague world ideas into rich, detailed settings with images and maps.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <label htmlFor="worldIdea" className="block font-semibold mb-2">
            World Concept
          </label>
          <TextArea
            id="worldIdea"
            value={worldIdea}
            onChange={(e) => setWorldIdea(e.target.value)}
            placeholder="Describe your world idea..."
            className="h-32"
          />
          <small className="text-sm text-warmGray">
            Describe your basic world concept - it will be expanded into a full setting
          </small>
        </div>

        <div className="text-center">
          <Button
            onClick={generateWorld}
            disabled={loading}
            className="bg-peach-400 hover:bg-peach-500 text-white px-6 py-3 rounded-full text-lg shadow-lg transition"
          >
            Generate World
          </Button>
          {loading && (
            <div className="mt-4 text-warmGray">
              Creating your world... This may take a few moments.
            </div>
          )}
        </div>

        {resultHtml && (
          <div className="mt-10">
            <div
              className="bg-white/80 p-6 rounded-xl shadow-xl"
              dangerouslySetInnerHTML={{ __html: resultHtml }}
            />
          </div>
        )}
      </div>
    </section>
  );
}


