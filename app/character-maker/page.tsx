"use client";

import { useEffect, useState } from "react";
import { Button, TextArea } from "@radix-ui/themes";

export default function CharacterGenerator() {
  const [apiKey, setApiKey] = useState<string>("YOUR_GEMINI_API_KEY_HERE");
  const [hfApiKey, setHfApiKey] = useState<string>("YOUR_HUGGINGFACE_API_KEY_HERE");
  const [characterPrompt, setCharacterPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [worldContext, setWorldContext] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("savedWorld");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWorldContext(parsed);
      } catch (e) {
        console.error("Failed to parse saved world:", e);
      }
    }
  }, []);

  const handleGenerate = async (): Promise<void> => {
    if (!apiKey || !hfApiKey || !characterPrompt) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const characterData = await callGeminiAPI(apiKey, characterPrompt);
      if (characterData.error) throw new Error(characterData.error);
      setResult(characterData);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const callGeminiAPI = async (key: string, prompt: string) => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const worldInfo = worldContext
      ? `Here is the world this character belongs to:\n\nName: ${worldContext.world_name}\nOverview: ${worldContext.world_overview}\n`
      : "";

    const fullPrompt = `${worldInfo}\nCreate a detailed character based on this idea: ${prompt}\nReturn ONLY valid JSON with fields like name, age, background, traits, class, etc.`;

    const payload = {
      contents: [{ parts: [{ text: fullPrompt }] }],
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
        <h1 className="text-5xl font-serif text-softBrown mb-4">Character Creator</h1>
        <p className="text-xl text-warmGray max-w-2xl mx-auto leading-relaxed">
          Turn your character ideas into fully developed, richly described RPG-ready characters.
        </p>
      </div>

      {/* This part can be commented to hide from the user */}

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

        {worldContext && (
          <div className="bg-white/60 p-4 rounded-lg border border-peach-200 shadow">
            <h2 className="text-lg font-semibold">Using World: {worldContext.world_name}</h2>
            <p className="text-sm text-warmGray">{worldContext.world_overview}</p>
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <label htmlFor="characterPrompt" className="block font-semibold mb-2">
            Character Concept
          </label>
          <TextArea
            id="characterPrompt"
            value={characterPrompt}
            onChange={(e) => setCharacterPrompt(e.target.value)}
            placeholder="Describe your character idea..."
            className="h-32 w-full"
          />
          <small className="text-sm text-warmGray">
            Describe your base character idea - it will be expanded into a full character profile.
          </small>
        </div>

        <div className="text-center">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-peach-400 hover:bg-peach-500 text-white px-6 py-3 rounded-full text-lg shadow-lg transition"
          >
            {loading ? "Generating..." : "Generate Character"}
          </Button>
          {loading && (
            <div className="mt-4 text-warmGray">
              Building your character... Please wait a moment.
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
            <h2 className="text-3xl font-bold mb-2">{result.name}</h2>
            <p className="mb-2"><strong>Age:</strong> {result.age}</p>
            <p className="mb-4 text-warmGray">{result.background}</p>

            <h3 className="text-xl font-semibold mt-4 mb-1">Traits</h3>
            <ul className="list-disc pl-5">
              {result.traits?.map((trait: string, idx: number) => (
                <li key={idx}>{trait}</li>
              ))}
            </ul>

            <p className="mt-4"><strong>Class:</strong> {result.class}</p>
          </div>
        )}
      </div>
    </section>
  );
}

