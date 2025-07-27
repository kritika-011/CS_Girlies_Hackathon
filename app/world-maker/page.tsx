"use client";

import { useState } from "react";

import { Button, TextArea } from "@radix-ui/themes";

export default function WorldGenerator() {
  const [apiKey, setApiKey] = useState<string>("YOUR_GEMINI_API_KEY_HERE");
  const [hfApiKey, setHfApiKey] = useState<string>("YOUR_HUGGINGFACE_API_KEY_HERE");
  const [worldIdea, setWorldIdea] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleGenerate = async (): Promise<void> => {
    if (!apiKey || !hfApiKey || !worldIdea) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const worldData = await callGeminiAPI(apiKey, worldIdea);
      if (worldData.error) throw new Error(worldData.error);
      setResult(worldData);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const callGeminiAPI = async (key: string, idea: string) => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const prompt = `Create a detailed world setting based on this concept: ${idea}\nOutput ONLY a valid JSON object with fields like world_name, world_overview, etc.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    };

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    const jsonText = text.substring(start, end);
    return JSON.parse(jsonText);
  };

  return (
    <section className="px-6 py-20 max-w-4xl mx-auto font-serif text-softBrown bg-gradient-to-b from-transparent to-cream-100/30">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-softBrown mb-4">World Generator</h1>
        <p className="text-xl text-warmGray max-w-2xl mx-auto leading-relaxed">
          Transform vague world ideas into rich, detailed settings with images and maps.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <label htmlFor="apiKey" className="block font-semibold mb-2">
            Gemini API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full mt-1 p-2 border border-border rounded-md bg-input text-foreground"
            placeholder="••••••••••••••"
          />
          <p className="text-sm text-warmGray mt-1">
            Get your free API key from{' '}
            <a
              href="https://console.cloud.google.com/ai-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-peach-500"
            >
              Google AI Studio
            </a>
            .
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <label htmlFor="hfApiKey" className="block font-semibold mb-2">
            Hugging Face API Key
          </label>
          <input
            id="hfApiKey"
            type="password"
            value={hfApiKey}
            onChange={(e) => setHfApiKey(e.target.value)}
            className="w-full mt-1 p-2 border border-border rounded-md bg-input text-foreground"
            placeholder="••••••••••••••"
          />
          <p className="text-sm text-warmGray mt-1">
            Get your free API key from{' '}
            <a
              href="https://huggingface.co"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-peach-500"
            >
              Hugging Face
            </a>
            .
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <label htmlFor="worldIdea" className="block font-semibold mb-2">
            World Concept
          </label>
          <TextArea
            id="worldIdea"
            value={worldIdea}
            onChange={(e) => setWorldIdea(e.target.value)}
            placeholder="Describe your world idea..."
            className="h-32 w-full"
          />
          <small className="text-sm text-warmGray">
            Describe your basic world concept - it will be expanded into a full setting
          </small>
        </div>

        <div className="text-center">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-peach-400 hover:bg-peach-500 text-white px-6 py-3 rounded-full text-lg shadow-lg transition"
          >
            {loading ? "Generating..." : "Generate World"}
          </Button>
          {loading && (
            <div className="mt-4 text-warmGray">
              Creating your world... This may take a few moments.
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 border border-destructive text-destructive-foreground rounded-md bg-white/80">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="mt-10 bg-white/80 p-6 rounded-xl shadow-xl">
            <h2 className="text-3xl font-bold mb-2">{result.world_name}</h2>
            <p className="mb-4 text-warmGray">{result.world_overview}</p>

            <h3 className="text-xl font-semibold mt-4 mb-1">Character Maker Summary</h3>
            <p className="italic text-sm mb-4">{result.character_maker_summary}</p>

            {result.places?.major_locations?.map((loc: any, idx: number) => (
              <div key={idx} className="mb-2">
                <strong>{loc.name}:</strong> {loc.description}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
