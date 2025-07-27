"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Added Input and Settings for the new form
import { Input } from "@/components/ui/input";
import { 
  Globe, 
  Users, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Download,
  Map,
  Home,
  ChevronDown,
  ChevronUp,
  BookOpen,
  User,
  Heart,
  BrainCircuit,
  Package,
  Target,
  Settings, // Icon for the new section
  Save      // Icon for save button
} from 'lucide-react';
import Link from 'next/link';

// --- Helper Components for Detailed Views ---
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

const StatBlock = ({ label, value }: { label: string; value: string | undefined }) => {
  if (!value) return null;
  return (
    <div>
      <h4 className="font-semibold text-softBrown">{label}</h4>
      <p className="text-warmGray text-sm mt-1">{value}</p>
    </div>
  );
};

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
// --- End Helper Components ---

// --- Interfaces for Worlds and Characters ---
interface World {
  id: string;
  world_name: string;
  world_overview: string;
  createdAt: string;
  mapDataUrl?: string;
  places?: any;
  magic_technology?: any;
  society_culture?: any;
  history_lore?: any;
  inhabitants?: any;
  generatedImages?: Array<any>;
  [key: string]: any;
}

interface Character {
  id: string;
  name: string;
  age?: string;
  race?: string;
  class?: string;
  background?: string;
  appearance?: string;
  personality?: {
    traits?: string[];
    ideals?: string;
    bonds?: string;
    flaws?: string;
  };
  abilities?: {
    strengths?: string[];
    skills?: string[];
    special_abilities?: string;
  };
  equipment?: {
    weapons?: string[];
    armor?: string;
    tools?: string[];
    personal_items?: string[];
  };
  relationships?: {
    allies?: string;
    enemies?: string;
    family?: string;
  };
  goals?: {
    short_term?: string;
    long_term?: string;
    secrets?: string;
  };
  world_integration?: string;
  portrait?: {
    url?: string;
    prompt?: string;
    error?: string;
  };
  worldId?: string;
  worldName?: string;
  createdAt: string;
  [key: string]: any;
}

export default function UnifiedDashboard() {
  const [savedWorlds, setSavedWorlds] = useState<World[]>([]);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'world-detail' | 'character-detail'>('overview');
  const [characterDropdownStates, setCharacterDropdownStates] = useState<{[key: string]: boolean}>({});

  // --- NEW STATE FOR API KEYS ---
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [hfApiKey, setHfApiKey] = useState<string>("");
  const [showApiForm, setShowApiForm] = useState<boolean>(false);

  useEffect(() => {
    // Load worlds and characters
    const worldsData = localStorage.getItem('savedWorlds');
    if (worldsData) {
      try { setSavedWorlds(JSON.parse(worldsData)); } catch (e) { console.error('Failed to load worlds:', e); }
    }
    const charactersData = localStorage.getItem('savedCharacters');
    if (charactersData) {
      try { setSavedCharacters(JSON.parse(charactersData)); } catch (e) { console.error('Failed to load characters:', e); }
    }
    
    // --- NEW: Load API Keys from localStorage ---
    const storedGeminiKey = localStorage.getItem('geminiApiKey');
    if (storedGeminiKey) setGeminiApiKey(storedGeminiKey);
    const storedHfKey = localStorage.getItem('hfApiKey');
    if (storedHfKey) setHfApiKey(storedHfKey);

  }, []);

  // --- NEW: Function to save API Keys ---
  const handleSaveApiKeys = () => {
    localStorage.setItem('geminiApiKey', geminiApiKey);
    localStorage.setItem('hfApiKey', hfApiKey);
    setShowApiForm(false); // Hide form on save
    alert('API Keys have been saved!');
  };

  const deleteWorld = (worldId: string) => {
    if (confirm("Are you sure you want to delete this world and all its characters?")) {
      const updatedWorlds = savedWorlds.filter(w => w.id !== worldId);
      const updatedCharacters = savedCharacters.filter(c => c.worldId !== worldId);
      setSavedWorlds(updatedWorlds);
      setSavedCharacters(updatedCharacters);
      localStorage.setItem('savedWorlds', JSON.stringify(updatedWorlds));
      localStorage.setItem('savedCharacters', JSON.stringify(updatedCharacters));
      if (selectedWorld?.id === worldId) {
        setSelectedWorld(null);
        setViewMode('overview');
      }
    }
  };

  const deleteCharacter = (characterId: string) => {
    if (confirm("Are you sure you want to delete this character?")) {
      const updatedCharacters = savedCharacters.filter(c => c.id !== characterId);
      setSavedCharacters(updatedCharacters);
      localStorage.setItem('savedCharacters', JSON.stringify(updatedCharacters));
      if(selectedCharacter?.id === characterId) {
        setSelectedCharacter(null);
        setViewMode('overview');
      }
    }
  };

  const downloadData = (data: object, filename: string) => {
    const { mapDataUrl, generatedImages, ...cleanData } = data as any;
    const dataStr = JSON.stringify(cleanData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadImage = (url: string, filename: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };
  
  const getCharactersForWorld = (worldId: string) => {
    return savedCharacters.filter(char => char.worldId === worldId);
  };

  const toggleCharacterDropdown = (worldId: string) => {
    setCharacterDropdownStates(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [worldId]: !prev[worldId]
    }));
  };

  const renderOverview = () => (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif text-softBrown mb-4">Your Story Dashboard</h1>
        <p className="text-xl text-warmGray max-w-3xl mx-auto leading-relaxed">
          Manage your worlds and characters. Start by creating a world, then add characters to bring it to life.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-warmGray">Total Worlds</CardTitle><Globe className="h-4 w-4 text-peach-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-softBrown">{savedWorlds.length}</div></CardContent></Card>
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-warmGray">Total Characters</CardTitle><Users className="h-4 w-4 text-sage-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-softBrown">{savedCharacters.length}</div></CardContent></Card>
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-warmGray">Populated Worlds</CardTitle><BookOpen className="h-4 w-4 text-purple-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-softBrown">{savedWorlds.filter(w => getCharactersForWorld(w.id).length > 0).length}</div></CardContent></Card>
      </div>
      {savedWorlds.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm p-12 rounded-2xl shadow-lg text-center"><h3 className="text-2xl font-serif text-warmGray mb-4">Welcome!</h3><p className="text-warmGray mb-8 max-w-2xl mx-auto">You haven't created any worlds yet. Start your storytelling journey by creating your first world.</p><Link href="/world-maker"><Button className="bg-peach-500 hover:bg-peach-600 text-white px-6 py-3"><Globe className="w-5 h-5 mr-2" />Create Your First World</Button></Link></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedWorlds.map((world) => {
            const worldCharacters = getCharactersForWorld(world.id);
            return (
              <div key={world.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col">
                {world.mapDataUrl && <img src={world.mapDataUrl} alt={`${world.world_name} Map`} className="w-full h-48 object-cover"/>}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-softBrown">{world.world_name}</h3>
                  <p className="text-warmGray text-sm mb-4 line-clamp-2 flex-grow">{world.world_overview}</p>
                  <div className="text-xs text-warmGray mb-4">Created: {new Date(world.createdAt).toLocaleDateString()}</div>
                  <div className="space-y-2 mt-auto">
                    <Button onClick={() => { setSelectedWorld(world); setViewMode('world-detail');}} className="w-full bg-peach-500 hover:bg-peach-600 text-white"><Eye className="w-4 h-4 mr-2" />View World Details</Button>
                    <div className="relative">
                      <Button onClick={() => toggleCharacterDropdown(world.id)} variant="outline" className="w-full border-sage-300 text-sage-600 hover:bg-sage-50"><Users className="w-4 h-4 mr-2" />Characters ({worldCharacters.length}){characterDropdownStates[world.id] ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}</Button>
                      {characterDropdownStates[world.id] && (
                        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-sage-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {worldCharacters.length > 0 ? (
                            worldCharacters.map((character) => (
                              <button key={character.id} onClick={() => { setSelectedCharacter(character); setViewMode('character-detail'); }} className="w-full text-left p-3 hover:bg-sage-50 border-b border-sage-100 last:border-b-0">
                                <p className="font-medium text-sage-800 text-sm">{character.name}</p>
                                <p className="text-xs text-sage-600 line-clamp-1">{character.background || "A mysterious figure..."}</p>
                              </button>
                            ))
                          ) : <div className="p-3 text-center text-sm text-sage-600">No characters yet.</div>}
                          <div className="p-2 border-t border-sage-200"><Link href={`/character-maker?worldId=${world.id}`}><Button size="sm" className="w-full bg-sage-500 hover:bg-sage-600 text-white"><Plus className="w-3 h-3 mr-1" />Add Character</Button></Link></div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2"><Button onClick={() => deleteWorld(world.id)} size="icon" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>{worldCharacters.length > 0 && <Link href={`/writer?worldId=${world.id}`} className="flex-1"><Button className="w-full bg-purple-600 hover:bg-purple-700 text-white"><Edit3 className="w-4 h-4 mr-2" />Write Story</Button></Link>}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderWorldDetail = () => { /* This function is unchanged */
    if (!selectedWorld) return null;
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => setViewMode('overview')} variant="outline" className="border-warmGray text-warmGray hover:bg-cream-50">
            ← Back to Dashboard
          </Button>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-softBrown">{selectedWorld.world_name}</h1>
              <p className="text-sm text-warmGray">Created: {new Date(selectedWorld.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2">
              {selectedWorld.mapDataUrl && <Button onClick={() => downloadImage(selectedWorld.mapDataUrl!, `${selectedWorld.world_name}_map.png`)} variant="outline" size="sm" className="border-peach-300 text-peach-600 hover:bg-peach-50"><Map className="w-4 h-4 mr-2" />Download Map</Button>}
              <Button onClick={() => downloadData(selectedWorld, `${selectedWorld.world_name}_data.json`)} variant="outline" size="sm" className="border-sage-300 text-sage-600 hover:bg-sage-50"><Download className="w-4 h-4 mr-2" />Download Data</Button>
            </div>
          </div>
          <div className="mb-8"><h2 className="text-2xl font-semibold mb-4 text-softBrown">Overview</h2><p className="text-warmGray leading-relaxed">{selectedWorld.world_overview}</p></div>
          {selectedWorld.generatedImages && selectedWorld.generatedImages.length > 0 && (
            <div className="mb-8"><h2 className="text-2xl font-semibold mb-4 text-softBrown">World Images</h2><div className="grid md:grid-cols-2 gap-6">{selectedWorld.generatedImages.map((img: any, idx: number) => (<div key={idx} className="bg-cream-50 p-4 rounded-lg border"><h3 className="font-semibold mb-3 text-softBrown">{img.title}</h3>{img.url ? (<div><img src={img.url} alt={img.title} className="w-full h-64 object-cover rounded-lg border border-gray-200 mb-3" /><Button onClick={() => downloadImage(img.url, `${img.title}.png`)} variant="outline" size="sm" className="border-peach-300 text-peach-600 hover:bg-peach-50"><Download className="w-4 h-4 mr-2" />Download</Button></div>) : (<div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200"><strong>Error:</strong> {img.error}</div>)}</div>))}</div></div>
          )}
          {selectedWorld.mapDataUrl && (<div className="mb-8"><h2 className="text-2xl font-semibold mb-4 text-softBrown">World Map</h2><img src={selectedWorld.mapDataUrl} alt="World Map" className="border border-gray-300 rounded-lg shadow-md max-w-full h-auto"/></div>)}
          <div className="grid md:grid-cols-2 gap-8 mb-8"><div><h2 className="text-2xl font-semibold mb-4 text-softBrown">Places</h2><div className="space-y-4"><h3 className="text-lg font-semibold text-softBrown">Major Locations</h3>{selectedWorld.places?.major_locations?.map((loc: any, idx: number) => (<div key={idx} className="p-4 bg-cream-50 rounded-lg border"><h3 className="font-semibold text-softBrown mb-2">{loc.name}</h3><p className="text-warmGray text-sm">{loc.description}</p></div>))}{selectedWorld.places?.notable_regions && <div className="mt-6"><h3 className="text-lg font-semibold mb-2 text-softBrown">Notable Regions</h3><p className="text-warmGray text-sm bg-cream-50 p-3 rounded-lg">{selectedWorld.places.notable_regions}</p></div>}</div></div><div className="space-y-6"><div><h2 className="text-2xl font-semibold mb-4 text-softBrown">Magic & Technology</h2><div className="space-y-3"><div className="p-3 bg-peach-50 rounded-lg"><h4 className="font-semibold text-peach-800 mb-1">System</h4><p className="text-peach-700 text-sm">{selectedWorld.magic_technology?.system_description}</p></div><div className="p-3 bg-peach-50 rounded-lg"><h4 className="font-semibold text-peach-800 mb-1">Common Uses</h4><p className="text-peach-700 text-sm">{selectedWorld.magic_technology?.common_applications}</p></div><div className="p-3 bg-peach-50 rounded-lg"><h4 className="font-semibold text-peach-800 mb-1">Advanced Aspects</h4><p className="text-peach-700 text-sm">{selectedWorld.magic_technology?.rare_powerful_aspects}</p></div></div></div><div><h2 className="text-2xl font-semibold mb-4 text-softBrown">Society & Culture</h2><div className="space-y-3"><div className="p-3 bg-sage-50 rounded-lg"><h4 className="font-semibold text-sage-800 mb-1">Social Structure</h4><p className="text-sage-700 text-sm">{selectedWorld.society_culture?.social_structure}</p></div><div className="p-3 bg-sage-50 rounded-lg"><h4 className="font-semibold text-sage-800 mb-1">Cultural Norms</h4><p className="text-sage-700 text-sm">{selectedWorld.society_culture?.cultural_norms}</p></div><div className="p-3 bg-sage-50 rounded-lg"><h4 className="font-semibold text-sage-800 mb-1">Conflicts</h4><p className="text-sage-700 text-sm">{selectedWorld.society_culture?.conflicts_tensions}</p></div></div></div></div></div>
          <div className="grid md:grid-cols-2 gap-8 mb-8"><div><h2 className="text-2xl font-semibold mb-4 text-softBrown">History & Lore</h2><div className="space-y-3"><div className="p-3 bg-purple-50 rounded-lg"><h4 className="font-semibold text-purple-800 mb-1">Founding Events</h4><p className="text-purple-700 text-sm">{selectedWorld.history_lore?.founding_events}</p></div><div className="p-3 bg-purple-50 rounded-lg"><h4 className="font-semibold text-purple-800 mb-1">Recent Developments</h4><p className="text-purple-700 text-sm">{selectedWorld.history_lore?.recent_developments}</p></div><div className="p-3 bg-purple-50 rounded-lg"><h4 className="font-semibold text-purple-800 mb-1">Mysteries & Legends</h4><p className="text-purple-700 text-sm">{selectedWorld.history_lore?.mysteries_legends}</p></div></div></div><div><h2 className="text-2xl font-semibold mb-4 text-softBrown">Inhabitants</h2><div className="space-y-3"><div className="p-3 bg-orange-50 rounded-lg"><h4 className="font-semibold text-orange-800 mb-1">Dominant Groups</h4><p className="text-orange-700 text-sm">{selectedWorld.inhabitants?.dominant_groups}</p></div><div className="p-3 bg-orange-50 rounded-lg"><h4 className="font-semibold text-orange-800 mb-1">Relationships</h4><p className="text-orange-700 text-sm">{selectedWorld.inhabitants?.relationships}</p></div><div className="p-3 bg-orange-50 rounded-lg"><h4 className="font-semibold text-orange-800 mb-1">Notable Figures</h4><p className="text-orange-700 text-sm">{selectedWorld.inhabitants?.notable_figures}</p></div></div></div></div>
        </div>
      </div>
    );
  };
  
  const renderCharacterDetail = () => { /* This function is unchanged */
    if (!selectedCharacter) return null;
    const { portrait, ...charData } = selectedCharacter;
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => setViewMode('overview')} variant="outline" className="border-warmGray text-warmGray hover:bg-cream-50">← Back to Dashboard</Button>
          <Button onClick={() => deleteCharacter(selectedCharacter.id)} variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2" />Delete Character</Button>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {selectedCharacter.portrait?.url && <img src={selectedCharacter.portrait.url} alt={`${selectedCharacter.name} Portrait`} className="w-full h-auto object-cover rounded-lg border border-gray-300 shadow-md"/>}
              <div>
                <h1 className="text-4xl font-serif text-softBrown mb-4">{selectedCharacter.name}</h1>
                <div className="space-y-2 text-warmGray border-t pt-4">
                  <p><strong>Age:</strong> {selectedCharacter.age || 'N/A'}</p>
                  <p><strong>Race:</strong> {selectedCharacter.race || 'N/A'}</p>
                  <p><strong>Class:</strong> {selectedCharacter.class || 'N/A'}</p>
                  <p><strong>World:</strong> {selectedCharacter.worldName || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <Button onClick={() => downloadData(charData, `${selectedCharacter.name}_data.json`)} className="w-full"><Download className="mr-2 h-4 w-4"/>Download JSON</Button>
                {selectedCharacter.portrait?.url && <Button onClick={() => downloadImage(selectedCharacter.portrait!.url!, `${selectedCharacter.name}_portrait.png`)} variant="secondary" className="w-full"><Download className="mr-2 h-4 w-4"/>Download Portrait</Button>}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <DetailSection title="Core Identity" icon={<User size={20} />}><StatBlock label="Background" value={selectedCharacter.background} /><StatBlock label="Appearance" value={selectedCharacter.appearance} /></DetailSection>
              {selectedCharacter.personality && <DetailSection title="Personality" icon={<Heart size={20} />}><div className="grid md:grid-cols-2 gap-4"><StatBlock label="Ideals" value={selectedCharacter.personality.ideals} /><StatBlock label="Bonds" value={selectedCharacter.personality.bonds} /><StatBlock label="Flaws" value={selectedCharacter.personality.flaws} /><StatList title="Traits" items={selectedCharacter.personality.traits} /></div></DetailSection>}
              {selectedCharacter.abilities && <DetailSection title="Abilities & Skills" icon={<BrainCircuit size={20} />}><StatBlock label="Special Abilities" value={selectedCharacter.abilities.special_abilities} /><div className="grid md:grid-cols-2 gap-4"><StatList title="Strengths" items={selectedCharacter.abilities.strengths} /><StatList title="Skills" items={selectedCharacter.abilities.skills} /></div></DetailSection>}
              {selectedCharacter.equipment && <DetailSection title="Equipment" icon={<Package size={20} />}><StatBlock label="Armor" value={selectedCharacter.equipment.armor} /><div className="grid md:grid-cols-2 gap-4"><StatList title="Weapons" items={selectedCharacter.equipment.weapons} /><StatList title="Tools" items={selectedCharacter.equipment.tools} /><StatList title="Personal Items" items={selectedCharacter.equipment.personal_items} /></div></DetailSection>}
              {selectedCharacter.relationships && <DetailSection title="Relationships" icon={<Users size={20} />}><StatBlock label="Family" value={selectedCharacter.relationships.family} /><div className="grid md:grid-cols-2 gap-4"><StatBlock label="Allies" value={selectedCharacter.relationships.allies} /><StatBlock label="Enemies" value={selectedCharacter.relationships.enemies} /></div></DetailSection>}
              {selectedCharacter.goals && <DetailSection title="Goals & Secrets" icon={<Target size={20} />}><StatBlock label="Long-Term Goals" value={selectedCharacter.goals.long_term} /><StatBlock label="Short-Term Goals" value={selectedCharacter.goals.short_term} /><StatBlock label="Secrets" value={selectedCharacter.goals.secrets} /></DetailSection>}
              <DetailSection title="Place in the World" icon={<Globe size={20} />}><StatBlock label="World Integration" value={selectedCharacter.world_integration} /></DetailSection>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <section className="px-6 py-8 font-serif text-softBrown bg-cream-100/30 min-h-screen">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity"><span className="text-xl font-serif font-bold text-softBrown">The Story Nook</span><span className="text-warmGray font-serif">/ Dashboard</span></Link>
          <div className="flex items-center space-x-3">
            <Link href="/world-maker"><Button className="bg-peach-500 hover:bg-peach-600 text-white"><Globe className="w-4 h-4 mr-2" />Create World</Button></Link>
            <Link href="/character-maker"><Button className="bg-sage-500 hover:bg-sage-600 text-white"><Users className="w-4 h-4 mr-2" />Create Character</Button></Link>
          </div>
        </div>
      </div>
      
      {viewMode === 'overview' && renderOverview()}
      {viewMode === 'world-detail' && renderWorldDetail()}
      {viewMode === 'character-detail' && renderCharacterDetail()}

      {/* --- NEW: API KEY SETTINGS SECTION AT THE BOTTOM --- */}
      <div className="max-w-7xl mx-auto mt-16 border-t border-cream-200 pt-8">
        <div className="max-w-2xl mx-auto">
          { !showApiForm ? (
              <div className="text-center">
                  <Button variant="outline" onClick={() => setShowApiForm(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Manage API Keys
                  </Button>
              </div>
          ) : (
            <div className="bg-white/80 p-6 rounded-2xl shadow-lg space-y-6">
              <div>
                <h3 className="text-xl font-bold text-softBrown">API Key Settings</h3>
                <p className="text-sm text-warmGray mt-1">These keys are stored securely in your browser's local storage.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="gemini-key" className="block text-sm font-medium text-softBrown mb-1">Gemini API Key</label>
                  <Input 
                    id="gemini-key"
                    type="password"
                    placeholder="Enter your Google AI Studio API Key" 
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="hf-key" className="block text-sm font-medium text-softBrown mb-1">Hugging Face API Key</label>
                  <Input 
                    id="hf-key"
                    type="password"
                    placeholder="Enter your Hugging Face API Key (for portraits)"
                    value={hfApiKey}
                    onChange={(e) => setHfApiKey(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="ghost" onClick={() => setShowApiForm(false)}>Cancel</Button>
                <Button onClick={handleSaveApiKeys}>
                  <Save className="w-4 h-4 mr-2"/>
                  Save Keys
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}