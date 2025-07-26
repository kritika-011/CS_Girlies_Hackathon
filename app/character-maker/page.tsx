'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@radix-ui/themes";
import { Button } from "@radix-ui/themes";

export default function CharacterCreator() {
  const [apiKey, setApiKey] = useState("");
  const [hfApiKey, setHfApiKey] = useState("");
  const [worldDescription, setWorldDescription] = useState("");
  const [characterIdea, setCharacterIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [characterResult, setCharacterResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    if (!apiKey || !hfApiKey || !worldDescription || !characterIdea) {
      setError("Please fill in all fields, including both API keys.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await fetch("/api/generate-character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, hfApiKey, worldDescription, characterIdea }),
      });
      const data = await result.json();
      if (data.error) {
        setError(data.error);
      } else {
        setCharacterResult(data);
      }
    } catch (err: any) {
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-6 py-20 max-w-4xl mx-auto font-serif text-softBrown bg-gradient-to-b from-transparent to-cream-100/30">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-softBrown mb-4">Character Creator</h1>
        <p className="text-xl text-warmGray max-w-2xl mx-auto leading-relaxed">
          Transform rough character ideas into story-ready personalities
        </p>
      </div>

      <div className="grid gap-6">
        {/* World Description */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <label className="block font-semibold mb-2">World Description</label>
          <TextArea
            value={worldDescription}
            onChange={(e) => setWorldDescription(e.target.value)}
            placeholder="Describe your story world in detail..."
            className="min-h-[120px]"
          />
        </div>

        {/* Character Idea */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <label className="block font-semibold mb-2">Character Idea</label>
          <TextArea
            value={characterIdea}
            onChange={(e) => setCharacterIdea(e.target.value)}
            placeholder="Describe your character idea..."
            className="min-h-[100px]"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-peach-400 hover:bg-peach-500 text-white px-6 py-3 rounded-full text-lg shadow-lg transition"
          >
            {isLoading ? "Generating..." : "Create Story Character"}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-700 border border-red-300 p-4 rounded-md bg-red-100 text-center font-medium">
            {error}
          </div>
        )}

        {/* Character Result */}
        {characterResult && (
          <div className="mt-10">
            <div className="bg-white/80 p-6 rounded-xl shadow-xl space-y-3">
              <h2 className="text-3xl font-serif text-softBrown">{characterResult.name}</h2>
              <p><strong>Age:</strong> {characterResult.age}</p>
              <p><strong>Role:</strong> {characterResult.role_in_story}</p>
              <p><strong>Appearance:</strong> {characterResult.appearance}</p>
              {/* can add more character details here */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


