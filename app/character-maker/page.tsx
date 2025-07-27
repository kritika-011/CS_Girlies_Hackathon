"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  Trash2,
  Download,
  Users,
  Globe,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
  User,
  Heart,
  BrainCircuit,
  Package,
  Target
} from 'lucide-react';
import Link from 'next/link';

// Helper component for displaying a list of items
const StatList = ({ title, items }: { title: string; items: string[] | undefined }) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="font-semibold text-softBrown">{title}</h4>
      <ul className="list-disc list-inside text-warmGray text-sm space-y-1 mt-1">
        {items.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>
  );
};

// Helper component for displaying a key-value pair
const StatBlock = ({ label, value }: { label: string; value: string | undefined }) => {
  if (!value) return null;
  return (
    <div>
      <h4 className="font-semibold text-softBrown">{label}</h4>
      <p className="text-warmGray text-sm mt-1">{value}</p>
    </div>
  );
};

// Helper component for a section with a title
const DetailSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-cream-50/50 p-4 rounded-lg border border-cream-200">
    <h3 className="text-xl font-semibold text-softBrown mb-3 flex items-center border-b border-cream-300 pb-2">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default function CharacterGenerator() {
  const [apiKey, setApiKey] = useState<string>("");
  const [hfApiKey, setHfApiKey] = useState<string>("");
  const [characterPrompt, setCharacterPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentCharacter, setCurrentCharacter] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [savedCharacters, setSavedCharacters] = useState<any[]>([]);
  const [savedWorlds, setSavedWorlds] = useState<any[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<any>(null);
  const [viewMode, setViewMode] = useState<string>('create'); // 'create', 'view'
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  const searchParams = useSearchParams();

  // Main setup effect for loading data from localStorage
  useEffect(() => {
    setIsClient(true);
    
    // --- MODIFIED: Load API keys from local storage ---
    const storedApiKey = localStorage.getItem('geminiApiKey');
    const storedHfApiKey = localStorage.getItem('hfApiKey');

    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      // If the required Gemini key is not found, set an error.
      setError("Gemini API Key not found. Please add it in the dashboard settings.");
    }

    if (storedHfApiKey) {
      setHfApiKey(storedHfApiKey);
    }
    
    // Load worlds data
    const worldsData = localStorage.getItem('savedWorlds');
    if (worldsData) {
      try {
        setSavedWorlds(JSON.parse(worldsData));
      } catch (e) {
        console.error('Failed to load saved worlds:', e);
      }
    }

    // Load characters data
    const charactersData = localStorage.getItem('savedCharacters');
    if (charactersData) {
      try {
        setSavedCharacters(JSON.parse(charactersData));
      } catch (e) {
        console.error('Failed to load saved characters:', e);
      }
    }
  }, []);

  // Effect for handling URL parameters once data is loaded
  useEffect(() => {
    if (!isClient) return;

    const characterIdToView = searchParams.get('view');
    const worldIdToSelect = searchParams.get('worldId');

    if (characterIdToView && savedCharacters.length > 0) {
      const charIndex = savedCharacters.findIndex(c => c.id === characterIdToView);
      if (charIndex !== -1) {
        setSelectedCharacterIndex(charIndex);
        setViewMode('view');
      }
    } else if (worldIdToSelect && savedWorlds.length > 0) {
      const worldToSelect = savedWorlds.find(w => w.id === worldIdToSelect);
      if (worldToSelect) {
        setSelectedWorld(worldToSelect);
      }
    }
  }, [isClient, searchParams, savedCharacters, savedWorlds]);

  // --- REMOVED: useEffects that saved API keys are no longer needed ---

  const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  };

  const generateCharacterPortrait = async (hfApiKey: string, character: any) => {
    if (!hfApiKey) {
      return character;
    }

    const modelId = "stabilityai/stable-diffusion-xl-base-1.0";
    const apiUrl = `https://api-inference.huggingface.co/models/${modelId}`;
    
    const portraitPrompt = `Portrait of ${character.name}, ${character.age} year old ${character.race || 'human'} ${character.class || 'adventurer'}, ${character.appearance || 'detailed fantasy character'}, high quality, detailed, fantasy art style, character portrait, professional artwork`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${hfApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          "inputs": portraitPrompt,
          "parameters": { "negative_prompt": "blurry, low quality, text, watermark, multiple people, crowd", "num_inference_steps": 30 }
        })
      });

      if (response.status === 503) {
        character.portrait = { error: "Model loading, try again later" };
        return character;
      }

      if (!response.ok) {
        character.portrait = { error: `Generation failed: ${response.status}` };
        return character;
      }

      const imageBlob = await response.blob();
      const imageUrl = await blobToDataURL(imageBlob);
      
      character.portrait = { url: imageUrl, prompt: portraitPrompt };

    } catch (error: any) {
      character.portrait = { error: `Error: ${error.message}` };
    }

    return character;
  };

  const callGeminiAPI = async (apiKey: string, characterIdea: string, worldContext: any) => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const worldInfo = worldContext
      ? `WORLD CONTEXT:
World Name: ${worldContext.world_name}
Overview: ${worldContext.world_overview}
Character Maker Summary: ${worldContext.character_maker_summary}

Magic/Technology: ${worldContext.magic_technology?.system_description || 'Standard fantasy'}
Society: ${worldContext.society_culture?.social_structure || 'Medieval fantasy'}
Dominant Groups: ${worldContext.inhabitants?.dominant_groups || 'Various fantasy races'}`
      : "Generic fantasy world with standard fantasy races and classes.";

    const prompt = `${worldInfo}

Create a detailed character based on this concept: ${characterIdea}

Output ONLY a valid JSON object with this structure:

{
  "name": "Character's full name",
  "age": "Character's age",
  "race": "Character's race/species",
  "class": "Character's class/profession",
  "background": "Detailed backstory and personal history",
  "appearance": "Physical description including clothing and distinctive features",
  "personality": { "traits": ["trait1", "trait2", "trait3"], "ideals": "What drives them", "bonds": "Important relationships or connections", "flaws": "Character weaknesses or limitations" },
  "abilities": { "strengths": ["strength1", "strength2", "strength3"], "skills": ["skill1", "skill2", "skill3"], "special_abilities": "Unique powers or talents" },
  "equipment": { "weapons": ["weapon1", "weapon2"], "armor": "Armor description", "tools": ["tool1", "tool2"], "personal_items": ["item1", "item2"] },
  "relationships": { "allies": "Important allies or friends", "enemies": "Notable enemies or rivals", "family": "Family members and relationships" },
  "goals": { "short_term": "Immediate objectives", "long_term": "Life goals and aspirations", "secrets": "Hidden motivations or secrets" },
  "world_integration": "How this character fits into the world setting and current events"
}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`API request failed: ${response.status}`);

      const responseJson = await response.json();
      const generatedText = responseJson.candidates[0].content.parts[0].text;
      
      let cleanedText = generatedText.trim();
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) throw new Error('No valid JSON found in response');
      
      cleanedText = cleanedText.substring(jsonStart, jsonEnd);
      const parsedData = JSON.parse(cleanedText);
      
      if (!parsedData.name || !parsedData.background) throw new Error('Missing essential character data. Please try again.');
      
      return parsedData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleGenerate = async (): Promise<void> => {
    // Clear previous non-API key errors
    if (!error.includes("API Key")) {
        setError("");
    }
    
    if (!apiKey) {
      setError("Cannot generate character. Gemini API Key not found. Please add it in the dashboard settings.");
      return;
    }
    if (!selectedWorld) {
      setError("Please select a world for your character.");
      return;
    }
    if (!characterPrompt) {
      setError("Please provide a concept for your character.");
      return;
    }

    setLoading(true);
    setCurrentCharacter(null);

    try {
      const characterData = await callGeminiAPI(apiKey, characterPrompt, selectedWorld);
      
      if (hfApiKey) {
        await generateCharacterPortrait(hfApiKey, characterData);
      }
      
      characterData.createdAt = new Date().toISOString();
      characterData.id = Date.now().toString();
      characterData.worldId = selectedWorld.id || selectedWorld.world_name;
      characterData.worldName = selectedWorld.world_name;
      
      setCurrentCharacter(characterData);
    } catch (err: any)      {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCharacter = () => {
    if (!currentCharacter) return;

    const updatedCharacters = [...savedCharacters, currentCharacter];
    setSavedCharacters(updatedCharacters);
    localStorage.setItem('savedCharacters', JSON.stringify(updatedCharacters));
    
    setSelectedCharacterIndex(updatedCharacters.length - 1);
    setViewMode('view');
    setCurrentCharacter(null);
    alert("Character saved successfully!");
  };

  const handleDiscardCharacter = () => {
    setCharacterPrompt("");
    setCurrentCharacter(null);
    setError("");
  };

  const downloadCharacterData = (character: any) => {
    const { portrait, ...cleanData } = character;
    const dataStr = JSON.stringify(cleanData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name.replace(/\s+/g, '_').toLowerCase()}_character.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const downloadPortrait = (character: any) => {
    if (!character.portrait?.url) return;
    
    const link = document.createElement('a');
    link.href = character.portrait.url;
    link.download = `${character.name.replace(/\s+/g, '_').toLowerCase()}_portrait.png`;
    link.click();
  };

  const renderWorldSelection = () => (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-6">
      <label className="block font-semibold mb-3">Select World</label>
      {savedWorlds.length === 0 ? (
        <div className="text-center p-6 bg-cream-50 rounded-lg border border-cream-200">
          <Globe className="w-12 h-12 mx-auto mb-3 text-warmGray" />
          <p className="text-warmGray mb-4">No worlds available. Create a world first to make characters.</p>
          <Link href="/world-maker">
            <Button className="bg-sage-500 hover:bg-sage-600 text-white">
              <Globe className="w-4 h-4 mr-2" /> Create World
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {savedWorlds.map((world) => (
            <div
              key={world.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedWorld?.id === world.id
                  ? 'border-peach-400 bg-peach-50'
                  : 'border-gray-200 bg-white hover:border-peach-300 hover:bg-peach-25'
              }`}
              onClick={() => setSelectedWorld(world)}
            >
              <h3 className="font-semibold text-softBrown">{world.world_name}</h3>
              <p className="text-sm text-warmGray line-clamp-2">{world.world_overview}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCreateMode = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-softBrown mb-4">Character Creator</h1>
        <p className="text-xl text-warmGray max-w-2xl mx-auto leading-relaxed">
          Create rich, detailed characters that fit perfectly into your worlds.
        </p>
      </div>

      <div className="grid gap-6">
        {renderWorldSelection()}

        {selectedWorld && (
          <>
            <div className="bg-white/60 p-4 rounded-lg border border-peach-200 shadow">
              <h2 className="text-lg font-semibold flex items-center">
                <Globe className="w-5 h-5 mr-2 text-peach-600" />
                Creating Character for: {selectedWorld.world_name}
              </h2>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <label htmlFor="characterPrompt" className="block font-semibold mb-2">Character Concept</label>
              <Textarea
                id="characterPrompt"
                value={characterPrompt}
                onChange={(e) => setCharacterPrompt(e.target.value)}
                placeholder="e.g., A cynical elven rogue who lost their family and now only trusts their pet raven..."
                className="h-32 w-full"
              />
            </div>
            <div className="text-center">
              <Button onClick={handleGenerate} disabled={loading || !selectedWorld || !!error} className="bg-peach-400 hover:bg-peach-500 text-white px-6 py-3 rounded-full text-lg shadow-lg transition disabled:bg-gray-400">
                {loading ? <><Sparkles className="w-5 h-5 mr-2 animate-spin" />Generating...</> : <><User className="w-5 h-5 mr-2" />Generate Character</>}
              </Button>
            </div>
          </>
        )}
        
        {error && <div className="mt-4 p-4 border border-destructive text-destructive-foreground rounded-md bg-white/80"><strong>Error:</strong> {error}</div>}

        {currentCharacter && (
          <div className="mt-10 bg-white/80 p-6 rounded-xl shadow-xl">
            <div className="flex justify-end space-x-4 mb-4">
              <Button onClick={handleDiscardCharacter} className="bg-red-100 text-red-600 hover:bg-red-200" variant="outline"><Trash2 className="w-4 h-4 mr-2" />Discard</Button>
              <Button onClick={handleSaveCharacter} className="bg-sage-500 text-white hover:bg-sage-600"><Save className="w-4 h-4 mr-2" />Save Character</Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                 {currentCharacter.portrait && (
                    <div className="md:col-span-1">
                      <h3 className="text-xl font-semibold mb-3">Portrait</h3>
                      {currentCharacter.portrait.url ? (
                        <div>
                          <img src={currentCharacter.portrait.url} alt={`${currentCharacter.name} Portrait`} className="w-full h-auto object-cover rounded-lg border border-gray-200 mb-2" />
                          <Button onClick={() => downloadPortrait(currentCharacter)} variant="outline" size="sm" className="border-peach-300 text-peach-600 hover:bg-peach-50 w-full"><Download className="w-4 h-4 mr-2" />Download Portrait</Button>
                        </div>
                      ) : <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">Error: {currentCharacter.portrait.error}</div>}
                    </div>
                  )}
                  <div className={currentCharacter.portrait ? "md:col-span-2" : "md:col-span-3"}>
                      <h2 className="text-3xl font-bold mb-2">{currentCharacter.name}</h2>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <p><strong>Age:</strong> {currentCharacter.age}</p>
                          <p><strong>Race:</strong> {currentCharacter.race}</p>
                          <p><strong>Class:</strong> {currentCharacter.class}</p>
                          <p><strong>World:</strong> {currentCharacter.worldName}</p>
                      </div>
                      <div className="space-y-4">
                          <StatBlock label="Background" value={currentCharacter.background} />
                          <StatBlock label="Appearance" value={currentCharacter.appearance} />
                      </div>
                  </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderViewMode = () => {
    // This function is unchanged
    if (savedCharacters.length === 0) {
       return (
         <div className="text-center p-10 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg max-w-md mx-auto">
            <Users className="w-16 h-16 mx-auto mb-4 text-warmGray" />
            <h2 className="text-2xl font-serif text-softBrown mb-2">No Saved Characters</h2>
            <p className="text-warmGray mb-6">You haven't saved any characters yet. Go to the 'Create' tab to start building your cast!</p>
            <Button onClick={() => setViewMode('create')} className="bg-peach-400 hover:bg-peach-500 text-white">
                <Plus className="mr-2 h-4 w-4" /> Create a Character
            </Button>
         </div>
       );
    }

    const character = savedCharacters[selectedCharacterIndex];
    if (!character) return null;

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="outline" className="border-warmGray text-warmGray hover:bg-cream-50">
              <ChevronLeft className="w-4 h-4 mr-2" />Back to Unified Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setSelectedCharacterIndex(Math.max(0, selectedCharacterIndex - 1))} disabled={selectedCharacterIndex === 0} variant="ghost" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-sm text-warmGray">{selectedCharacterIndex + 1} of {savedCharacters.length}</span>
            <Button onClick={() => setSelectedCharacterIndex(Math.min(savedCharacters.length - 1, selectedCharacterIndex + 1))} disabled={selectedCharacterIndex === savedCharacters.length - 1} variant="ghost" size="sm"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {character.portrait?.url && (
                <img src={character.portrait.url} alt={`${character.name} Portrait`} className="w-full h-auto object-cover rounded-lg border border-gray-300 shadow-md"/>
              )}
               <div>
                  <h1 className="text-4xl font-serif text-softBrown mb-4">{character.name}</h1>
                  <div className="space-y-2 text-warmGray border-t pt-4">
                      <p><strong>Age:</strong> {character.age}</p>
                      <p><strong>Race:</strong> {character.race}</p>
                      <p><strong>Class:</strong> {character.class}</p>
                      <p><strong>World:</strong> {character.worldName}</p>
                  </div>
              </div>
              <div className="space-y-4">
                 <Button onClick={() => downloadCharacterData(character)} className="w-full"><Download className="mr-2 h-4 w-4"/>Download JSON</Button>
                 {character.portrait?.url && <Button onClick={() => downloadPortrait(character)} variant="secondary" className="w-full"><Download className="mr-2 h-4 w-4"/>Download Portrait</Button>}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <DetailSection title="Core Identity" icon={<User size={20} />}><StatBlock label="Background" value={character.background} /><StatBlock label="Appearance" value={character.appearance} /></DetailSection>
              {character.personality && (<DetailSection title="Personality" icon={<Heart size={20} />}><div className="grid md:grid-cols-2 gap-4"><StatBlock label="Ideals" value={character.personality.ideals} /><StatBlock label="Bonds" value={character.personality.bonds} /><StatBlock label="Flaws" value={character.personality.flaws} /><StatList title="Traits" items={character.personality.traits} /></div></DetailSection>)}
              {character.abilities && (<DetailSection title="Abilities & Skills" icon={<BrainCircuit size={20} />}><StatBlock label="Special Abilities" value={character.abilities.special_abilities} /><div className="grid md:grid-cols-2 gap-4"><StatList title="Strengths" items={character.abilities.strengths} /><StatList title="Skills" items={character.abilities.skills} /></div></DetailSection>)}
              {character.equipment && (<DetailSection title="Equipment" icon={<Package size={20} />}><StatBlock label="Armor" value={character.equipment.armor} /><div className="grid md:grid-cols-2 gap-4"><StatList title="Weapons" items={character.equipment.weapons} /><StatList title="Tools" items={character.equipment.tools} /><StatList title="Personal Items" items={character.equipment.personal_items} /></div></DetailSection>)}
              {character.relationships && (<DetailSection title="Relationships" icon={<Users size={20} />}><StatBlock label="Family" value={character.relationships.family} /><div className="grid md:grid-cols-2 gap-4"><StatBlock label="Allies" value={character.relationships.allies} /><StatBlock label="Enemies" value={character.relationships.enemies} /></div></DetailSection>)}
              {character.goals && (<DetailSection title="Goals & Secrets" icon={<Target size={20} />}><StatBlock label="Long-Term Goals" value={character.goals.long_term} /><StatBlock label="Short-Term Goals" value={character.goals.short_term} /><StatBlock label="Secrets" value={character.goals.secrets} /></DetailSection>)}
              <DetailSection title="Place in the World" icon={<Globe size={20} />}><StatBlock label="World Integration" value={character.world_integration} /></DetailSection>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <section className="px-6 py-12 font-serif bg-cream-100/30 min-h-screen">
      <nav className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Link href="/"><Button variant="ghost"><Home className="mr-2 h-4 w-4" /> Home</Button></Link>
            <Link href="/dashboard"><Button variant="ghost"><Globe className="mr-2 h-4 w-4" /> Dashboard</Button></Link>
        </div>
        <div>
          <Button onClick={() => { setViewMode('create'); setCurrentCharacter(null); }} variant={viewMode === 'create' ? 'secondary' : 'ghost'}>
            <Plus className="mr-2 h-4 w-4" /> Create Character
          </Button>
          <Button onClick={() => setViewMode('view')} variant={viewMode === 'view' ? 'secondary' : 'ghost'} disabled={savedCharacters.length === 0}>
            <Users className="mr-2 h-4 w-4" /> View Saved ({savedCharacters.length})
          </Button>
        </div>
      </nav>

      {viewMode === 'create' ? renderCreateMode() : renderViewMode()}
    </section>
  );
}