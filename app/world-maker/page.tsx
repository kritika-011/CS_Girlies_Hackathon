"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
Save,
Trash2,
Download,
Eye,
Map,
Globe,
Sparkles,
ChevronLeft,
ChevronRight,
Home,
Plus
} from 'lucide-react';
import Link from 'next/link';

export default function WorldGenerator() {
const [apiKey, setApiKey] = useState<string>("");
const [hfApiKey, setHfApiKey] = useState<string>("");
const [worldIdea, setWorldIdea] = useState<string>("");
const [loading, setLoading] = useState<boolean>(false);
const [currentWorld, setCurrentWorld] = useState<any>(null);
const [error, setError] = useState<string>("");
const [savedWorlds, setSavedWorlds] = useState<any[]>([]);
const [viewMode, setViewMode] = useState<string>('create'); // 'create', 'view'
const [selectedWorldIndex, setSelectedWorldIndex] = useState<number>(0);

const searchParams = useSearchParams();

useEffect(() => {
// --- MODIFIED: Load API keys from local storage ---
const storedApiKey = localStorage.getItem('geminiApiKey');
const storedHfApiKey = localStorage.getItem('hfApiKey');

if (!storedApiKey) {
setError("Gemini API Key not found in localStorage. Please configure it in the dashboard first.");
} else {
setApiKey(storedApiKey);
}

if (storedHfApiKey) {
setHfApiKey(storedHfApiKey);
}

// Load saved worlds from localStorage
const saved = localStorage.getItem('savedWorlds');
const worlds = saved ? JSON.parse(saved) : [];
setSavedWorlds(worlds);

// Check for a 'view' URL parameter to directly open a world
const viewId = searchParams.get('view');
if (viewId && worlds.length > 0) {
const worldIndex = worlds.findIndex((w: any) => w.id === viewId);
if (worldIndex !== -1) {
setSelectedWorldIndex(worldIndex);
setViewMode('view');
}
}
}, [searchParams]);

const hashString = (str: string): number => {
let hash = 0;
for (let i = 0; i < str.length; i++) {
const char = str.charCodeAt(i);
hash = ((hash << 5) - hash) + char;
hash = hash & hash;
}
return Math.abs(hash);
};

const seededRandom = (seed: number) => {
let m = 0x80000000;
let a = 1103515245;
let c = 12345;

return function() {
seed = (a * seed + c) % m;
return seed / (m - 1);
};
};

const getAreaColor = (index: number, total: number): string => {
const colors = [
'#FFE4B5', '#DDA0DD', '#98FB98', '#F0E68C', '#FFB6C1', '#87CEEB',
'#D2B48C', '#F5DEB3', '#E0E0E0', '#FFA07A', '#20B2AA', '#9370DB'
];
return colors[index % colors.length];
};

const generateSimpleMap = (world: any): string => {
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d')!;

// Background
ctx.fillStyle = '#f5f5f5';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Border
ctx.strokeStyle = '#000000';
ctx.lineWidth = 3;
ctx.strokeRect(0, 0, canvas.width, canvas.height);

// Title
ctx.fillStyle = '#000000';
ctx.font = 'bold 24px Arial';
ctx.textAlign = 'center';
ctx.fillText(world.world_name || 'World Map', canvas.width / 2, 35);

if (world.places && world.places.major_locations) {
const locations = world.places.major_locations;
const padding = 60;
const mapWidth = canvas.width - padding * 2;
const mapHeight = canvas.height - padding * 2 - 40;

// Generate area properties
const areas = locations.map((location: any, index: number) => {
const seed = hashString(location.name);
const rng = seededRandom(seed);

return {
name: location.name,
description: location.description,
width: 120 + rng() * 80,
height: 80 + rng() * 60,
color: getAreaColor(index, locations.length),
borderColor: '#333333'
};
});

// Position areas
const cols = Math.ceil(Math.sqrt(locations.length));
const baseAreaWidth = mapWidth / cols;
const baseAreaHeight = mapHeight / Math.ceil(locations.length / cols);

areas.forEach((area: any, index: number) => {
const col = index % cols;
const row = Math.floor(index / cols);

const seed = hashString(area.name + 'pos');
const rng = seededRandom(seed);

const baseX = padding + col * baseAreaWidth;
const baseY = padding + 40 + row * baseAreaHeight;

const x = baseX + (rng() - 0.5) * 40;
const y = baseY + (rng() - 0.5) * 30;

const finalX = Math.max(padding, Math.min(x, canvas.width - padding - area.width));
const finalY = Math.max(padding + 40, Math.min(y, canvas.height - padding - area.height));

area.x = finalX;
area.y = finalY;
});

// Draw routes
ctx.strokeStyle = '#888888';
ctx.lineWidth = 2;
ctx.setLineDash([5, 5]);

for (let i = 0; i < areas.length; i++) {
for (let j = i + 1; j < areas.length; j++) {
const area1 = areas[i];
const area2 = areas[j];

const x1 = area1.x + area1.width / 2;
const y1 = area1.y + area1.height / 2;
const x2 = area2.x + area2.width / 2;
const y2 = area2.y + area2.height / 2;

ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.stroke();
}
}
ctx.setLineDash([]);

// Draw areas
areas.forEach((area: any, index: number) => {
ctx.fillStyle = area.color;
ctx.fillRect(area.x, area.y, area.width, area.height);

ctx.strokeStyle = area.borderColor;
ctx.lineWidth = 2;
ctx.strokeRect(area.x, area.y, area.width, area.height);

ctx.fillStyle = '#000000';
ctx.font = 'bold 14px Arial';
ctx.textAlign = 'center';

const words = area.name.split(' ');
if (words.length > 2) {
const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
ctx.fillText(line1, area.x + area.width / 2, area.y + area.height / 2 - 5);
ctx.fillText(line2, area.x + area.width / 2, area.y + area.height / 2 + 15);
} else {
ctx.fillText(area.name, area.x + area.width / 2, area.y + area.height / 2 + 5);
}

ctx.font = '10px Arial';
ctx.fillStyle = '#666666';
ctx.textAlign = 'left';
ctx.fillText(`Area ${index + 1}`, area.x + 5, area.y + 15);
});
}

return canvas.toDataURL();
};

/**
* Converts a Blob object to a Base64 Data URL.
* @param blob The blob to convert.
* @returns A promise that resolves with the Data URL string.
*/
const blobToDataURL = (blob: Blob): Promise<string> => {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onloadend = () => resolve(reader.result as string);
reader.onerror = reject;
reader.readAsDataURL(blob);
});
};

const generateWorldImages = async (hfApiKey: string, world: any) => {
if (!hfApiKey || hfApiKey === "YOUR_HUGGINGFACE_API_KEY_HERE") {
return world; // Skip image generation if no API key
}

const modelId = "stabilityai/stable-diffusion-xl-base-1.0";
const apiUrl = `https://api-inference.huggingface.co/models/${modelId}`;

world.generatedImages = [];

for (let i = 0; i < world.image_prompts.length; i++) {
const imagePrompt = world.image_prompts[i];
const finalPrompt = `${imagePrompt.prompt}, high quality, detailed, fantasy art style`;

try {
const response = await fetch(apiUrl, {
method: 'POST',
headers: {
"Authorization": `Bearer ${hfApiKey}`,
"Content-Type": "application/json"
},
body: JSON.stringify({
"inputs": finalPrompt,
"parameters": {
"negative_prompt": "blurry, low quality, text, watermark",
"num_inference_steps": 30
}
})
});

if (response.status === 503) {
world.generatedImages.push({
title: imagePrompt.title,
error: "Model loading, try again later"
});
continue;
}

if (!response.ok) {
world.generatedImages.push({
title: imagePrompt.title,
error: `Generation failed: ${response.status}`
});
continue;
}

const imageBlob = await response.blob();
// **FIX:** Convert blob to a permanent, storable Data URL instead of a temporary object URL.
const imageUrl = await blobToDataURL(imageBlob);

world.generatedImages.push({
title: imagePrompt.title,
url: imageUrl
});

} catch (error: any) {
world.generatedImages.push({
title: imagePrompt.title,
error: `Error: ${error.message}`
});
}
}

return world;
};

const callGeminiAPI = async (apiKey: string, worldIdea: string) => {
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

const prompt = `Create a detailed world setting based on this concept: ${worldIdea}

Output ONLY a valid JSON object with this structure:

{
"world_name": "Creative name for the world",
"world_overview": "Comprehensive overview describing the world's core concept and atmosphere",
"places": {
"major_locations": [
{"name": "Location 1", "description": "Detailed description"},
{"name": "Location 2", "description": "Detailed description"},
{"name": "Location 3", "description": "Detailed description"}
],
"notable_regions": "Description of broader geographic regions and terrain"
},
"magic_technology": {
"system_description": "How magic/technology works",
"common_applications": "How people use it daily",
"rare_powerful_aspects": "Advanced applications"
},
"society_culture": {
"social_structure": "How society is organized",
"cultural_norms": "Important customs and traditions",
"conflicts_tensions": "Major sources of conflict"
},
"history_lore": {
"founding_events": "Key historical events",
"recent_developments": "Current events",
"mysteries_legends": "Unexplained phenomena or legends"
},
"inhabitants": {
"dominant_groups": "Major peoples or factions",
"relationships": "How groups interact",
"notable_figures": "Important leaders or heroes"
},
"image_prompts": [
{"title": "Overview Scene", "prompt": "Visual description for overview image of the world"},
{"title": "People Scene", "prompt": "Visual description showing people walking and living in this world"}
],
"character_maker_summary": "Concise description with key points for character creation dialogue"
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

if (!response.ok) {
throw new Error(`API request failed: ${response.status}`);
}

const responseJson = await response.json();
const generatedText = responseJson.candidates[0].content.parts[0].text;

let cleanedText = generatedText.trim();
const jsonStart = cleanedText.indexOf('{');
const jsonEnd = cleanedText.lastIndexOf('}') + 1;

if (jsonStart === -1 || jsonEnd === 0) {
throw new Error('No valid JSON found in response');
}

cleanedText = cleanedText.substring(jsonStart, jsonEnd);
const parsedData = JSON.parse(cleanedText);

if (!parsedData.world_name || !parsedData.world_overview) {
throw new Error('Missing essential world data. Please try again.');
}

return parsedData;
} catch (error: any) {
throw new Error(error.message);
}
};

const handleGenerate = async (): Promise<void> => {
if (!apiKey || !worldIdea) {
setError("Please fill in all required fields and ensure API keys are configured in the dashboard.");
return;
}

setLoading(true);
setCurrentWorld(null);
setError("");

try {
const worldData = await callGeminiAPI(apiKey, worldIdea);

// Generate images if HF API key is provided
if (hfApiKey && hfApiKey !== "YOUR_HUGGINGFACE_API_KEY_HERE") {
await generateWorldImages(hfApiKey, worldData);
}

// Generate map
const mapDataUrl = generateSimpleMap(worldData);
worldData.mapDataUrl = mapDataUrl;
worldData.createdAt = new Date().toISOString();
worldData.id = Date.now().toString();

setCurrentWorld(worldData);
} catch (err: any) {
setError(err.message || "Unexpected error occurred");
} finally {
setLoading(false);
}
};

const handleSaveWorld = () => {
if (!currentWorld) return;

// Store character_maker_summary in backend (localStorage for now)
const worldForCharacterMaker = {
world_name: currentWorld.world_name,
world_overview: currentWorld.world_overview,
character_maker_summary: currentWorld.character_maker_summary,
places: currentWorld.places,
magic_technology: currentWorld.magic_technology,
society_culture: currentWorld.society_culture,
history_lore: currentWorld.history_lore,
inhabitants: currentWorld.inhabitants
};

const updatedWorlds = [...savedWorlds, currentWorld];
setSavedWorlds(updatedWorlds);
localStorage.setItem('savedWorlds', JSON.stringify(updatedWorlds));

// Save to character maker context (backend storage)
localStorage.setItem("savedWorld", JSON.stringify(worldForCharacterMaker));

alert("World saved successfully!");
};

const handleDiscardWorld = () => {
setWorldIdea("");
setCurrentWorld(null);
setError("");
};

const downloadWorldData = (world: any) => {
const cleanData = {
world_name: world.world_name,
world_overview: world.world_overview,
places: world.places,
magic_technology: world.magic_technology,
society_culture: world.society_culture,
history_lore: world.history_lore,
inhabitants: world.inhabitants
};

const dataStr = JSON.stringify(cleanData, null, 2);
const dataBlob = new Blob([dataStr], {type: 'application/json'});
const url = URL.createObjectURL(dataBlob);

const link = document.createElement('a');
link.href = url;
link.download = `${world.world_name.replace(/\s+/g, '_').toLowerCase()}_data.json`;
link.click();

URL.revokeObjectURL(url);
};

const downloadMap = (world: any) => {
if (!world.mapDataUrl) return;

const link = document.createElement('a');
link.href = world.mapDataUrl;
link.download = `${world.world_name.replace(/\s+/g, '_').toLowerCase()}_map.png`;
link.click();
};

const downloadImage = (title: string, url: string) => {
const link = document.createElement('a');
link.href = url;
link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`;
link.click();
};

const renderCreateMode = () => (
<div className="max-w-4xl mx-auto">
<div className="text-center mb-16">
<h1 className="text-5xl font-serif text-softBrown mb-4">World Generator</h1>
<p className="text-xl text-warmGray max-w-2xl mx-auto leading-relaxed">
Transform vague world ideas into rich, detailed settings with maps and lore.
</p>
</div>

<div className="grid gap-6">
<div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
<label htmlFor="worldIdea" className="block font-semibold mb-2">
World Concept
</label>
<Textarea
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
{loading ? (
<>
<Sparkles className="w-5 h-5 mr-2 animate-spin" />
Generating...
</>
) : (
<>
<Globe className="w-5 h-5 mr-2" />
Generate World
</>
)}
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

{currentWorld && (
<div className="mt-10 bg-white/80 p-6 rounded-xl shadow-xl">
<div className="flex justify-end space-x-4 mb-4">
<Button
onClick={handleDiscardWorld}
className="bg-red-100 text-red-600 hover:bg-red-200"
variant="outline"
>
<Trash2 className="w-4 h-4 mr-2" />
Discard
</Button>
<Button
onClick={handleSaveWorld}
className="bg-sage-500 text-white hover:bg-sage-600"
>
<Save className="w-4 h-4 mr-2" />
Save World
</Button>
</div>

<h2 className="text-3xl font-bold mb-2">{currentWorld.world_name}</h2>
<p className="mb-4 text-warmGray">{currentWorld.world_overview}</p>

{/* World Images */}
{currentWorld.generatedImages && currentWorld.generatedImages.length > 0 && (
<div className="mb-6">
<h3 className="text-xl font-semibold mb-3">World Images</h3>
<div className="grid md:grid-cols-2 gap-4">
{currentWorld.generatedImages.map((img: any, idx: number) => (
<div key={idx} className="bg-cream-50 p-4 rounded-lg">
<h4 className="font-semibold mb-2 text-softBrown">{img.title}</h4>
{img.url ? (
<div>
<img
src={img.url}
alt={img.title}
className="w-full h-48 object-cover rounded-lg border border-gray-200 mb-2"
/>
<Button
onClick={() => downloadImage(img.title, img.url)}
variant="outline"
size="sm"
className="border-peach-300 text-peach-600 hover:bg-peach-50"
>
<Download className="w-4 h-4 mr-2" />
Download
</Button>
</div>
) : (
<div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
Error: {img.error}
</div>
)}
</div>
))}
</div>
</div>
)}

{currentWorld.mapDataUrl && (
<div className="mb-6">
<h3 className="text-xl font-semibold mb-3">World Map</h3>
<img
src={currentWorld.mapDataUrl}
alt="World Map"
className="border border-gray-300 rounded-lg shadow-md max-w-full h-auto"
/>
<Button
onClick={() => downloadMap(currentWorld)}
variant="outline"
size="sm"
className="mt-2"
>
<Download className="w-4 h-4 mr-2" />
Download Map
</Button>
</div>
)}

{currentWorld.places?.major_locations?.map((loc: any, idx: number) => (
<div key={idx} className="mb-2">
<strong>{loc.name}:</strong> {loc.description}
</div>
))}

<div className="mt-6 text-center">
<Button
onClick={() => downloadWorldData(currentWorld)}
variant="outline"
className="border-purple-300 text-purple-600 hover:bg-purple-50"
>
<Download className="w-4 h-4 mr-2" />
Download Complete World Data
</Button>
</div>
</div>
)}
</div>
</div>
);

const renderViewMode = () => {
const world = savedWorlds[selectedWorldIndex];
if (!world) return null;

return (
<div className="max-w-6xl mx-auto">
<div className="flex items-center justify-between mb-8">
<Link href="/dashboard">
<Button
variant="outline"
className="border-warmGray text-warmGray hover:bg-cream-50"
>
<ChevronLeft className="w-4 h-4 mr-2" />
Back to Unified Dashboard
</Button>
</Link>

<div className="flex items-center space-x-4">
<Button
onClick={() => setSelectedWorldIndex(Math.max(0, selectedWorldIndex - 1))}
disabled={selectedWorldIndex === 0}
variant="ghost"
size="sm"
>
<ChevronLeft className="w-4 h-4" />
</Button>
<span className="text-sm text-warmGray">
{selectedWorldIndex + 1} of {savedWorlds.length}
</span>
<Button
onClick={() => setSelectedWorldIndex(Math.min(savedWorlds.length - 1, selectedWorldIndex + 1))}
disabled={selectedWorldIndex === savedWorlds.length - 1}
variant="ghost"
size="sm"
>
<ChevronRight className="w-4 h-4" />
</Button>
</div>
</div>

<div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
<div className="flex justify-between items-start mb-6">
<div>
<h1 className="text-4xl font-bold mb-2 text-softBrown">{world.world_name}</h1>
<p className="text-sm text-warmGray">
Created: {new Date(world.createdAt).toLocaleDateString()}
</p>
</div>
<div className="flex space-x-2">
<Button
onClick={() => downloadMap(world)}
variant="outline"
size="sm"
className="border-peach-300 text-peach-600 hover:bg-peach-50"
>
<Map className="w-4 h-4 mr-2" />
Download Map
</Button>
<Button
onClick={() => downloadWorldData(world)}
variant="outline"
size="sm"
className="border-sage-300 text-sage-600 hover:bg-sage-50"
>
<Download className="w-4 h-4 mr-2" />
Download Data
</Button>
</div>
</div>

<div className="mb-8">
<h2 className="text-2xl font-semibold mb-4 text-softBrown">Overview</h2>
<p className="text-warmGray leading-relaxed">{world.world_overview}</p>
</div>

{/* World Images */}
{world.generatedImages && world.generatedImages.length > 0 && (
<div className="mb-8">
<h2 className="text-2xl font-semibold mb-4 text-softBrown">World Images</h2>
<div className="grid md:grid-cols-2 gap-6">
{world.generatedImages.map((img: any, idx: number) => (
<div key={idx} className="bg-cream-50 p-4 rounded-lg border">
<h3 className="font-semibold mb-3 text-softBrown">{img.title}</h3>
{img.url ? (
<div>
<img
src={img.url}
alt={img.title}
className="w-full h-64 object-cover rounded-lg border border-gray-200 mb-3"
/>
<Button
onClick={() => downloadImage(img.title, img.url)}
variant="outline"
size="sm"
className="border-peach-300 text-peach-600 hover:bg-peach-50"
>
<Download className="w-4 h-4 mr-2" />
Download Image
</Button>
</div>
) : (
<div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
<strong>Error:</strong> {img.error}
</div>
)}
</div>
))}
</div>
</div>
)}

{world.mapDataUrl && (
<div className="mb-8">
<h2 className="text-2xl font-semibold mb-4 text-softBrown">World Map</h2>
<img
src={world.mapDataUrl}
alt="World Map"
className="border border-gray-300 rounded-lg shadow-md max-w-full h-auto"
/>
</div>
)}

<div className="grid md:grid-cols-2 gap-8 mb-8">
<div>
<h2 className="text-2xl font-semibold mb-4 text-softBrown">Major Locations</h2>
<div className="space-y-4">
{world.places?.major_locations?.map((loc: any, idx: number) => (
<div key={idx} className="p-4 bg-cream-50 rounded-lg border">
<h3 className="font-semibold text-softBrown mb-2">{loc.name}</h3>
<p className="text-warmGray text-sm">{loc.description}</p>
</div>
))}
</div>

{world.places?.notable_regions && (
<div className="mt-6">
<h3 className="text-lg font-semibold mb-2 text-softBrown">Notable Regions</h3>
<p className="text-warmGray text-sm bg-cream-50 p-3 rounded-lg">
{world.places.notable_regions}
</p>
</div>
)}
</div>

<div className="space-y-6">
<div>
<h2 className="text-2xl font-semibold mb-4 text-softBrown">Magic & Technology</h2>
<div className="space-y-3">
<div className="p-3 bg-peach-50 rounded-lg">
<h4 className="font-semibold text-peach-800 mb-1">System</h4>
<p className="text-peach-700 text-sm">{world.magic_technology?.system_description}</p>
</div>
<div className="p-3 bg-peach-50 rounded-lg">
<h4 className="font-semibold text-peach-800 mb-1">Common Uses</h4>
<p className="text-peach-700 text-sm">{world.magic_technology?.common_applications}</p>
</div>
<div className="p-3 bg-peach-50 rounded-lg">
<h4 className="font-semibold text-peach-800 mb-1">Advanced Applications</h4>
<p className="text-peach-700 text-sm">{world.magic_technology?.rare_powerful_aspects}</p>
</div>
</div>
</div>

<div>
<h2 className="text-2xl font-semibold mb-4 text-softBrown">Society & Culture</h2>
<div className="space-y-3">
<div className="p-3 bg-sage-50 rounded-lg">
<h4 className="font-semibold text-sage-800 mb-1">Social Structure</h4>
<p className="text-sage-700 text-sm">{world.society_culture?.social_structure}</p>
</div>
<div className="p-3 bg-sage-50 rounded-lg">
<h4 className="font-semibold text-sage-800 mb-1">Cultural Norms</h4>
<p className="text-sage-700 text-sm">{world.society_culture?.cultural_norms}</p>
</div>
<div className="p-3 bg-sage-50 rounded-lg">
<h4 className="font-semibold text-sage-800 mb-1">Conflicts & Tensions</h4>
<p className="text-sage-700 text-sm">{world.society_culture?.conflicts_tensions}</p>
</div>
</div>
</div>
</div>
</div>

<div className="grid md:grid-cols-2 gap-8 mb-8">
<div>
<h2 className="text-2xl font-semibold mb-4 text-softBrown">History & Lore</h2>
<div className="space-y-3">
<div className="p-3 bg-purple-50 rounded-lg">
<h4 className="font-semibold text-purple-800 mb-1">Founding Events</h4>
<p className="text-purple-700 text-sm">{world.history_lore?.founding_events}</p>
</div>
<div className="p-3 bg-purple-50 rounded-lg">
<h4 className="font-semibold text-purple-800 mb-1">Recent Developments</h4>
<p className="text-purple-700 text-sm">{world.history_lore?.recent_developments}</p>
</div>
<div className="p-3 bg-purple-50 rounded-lg">
<h4 className="font-semibold text-purple-800 mb-1">Mysteries & Legends</h4>
<p className="text-purple-700 text-sm">{world.history_lore?.mysteries_legends}</p>
</div>
</div>
</div>

<div>
<h2 className="text-2xl font-semibold mb-4 text-softBrown">Inhabitants</h2>
<div className="space-y-3">
<div className="p-3 bg-orange-50 rounded-lg">
<h4 className="font-semibold text-orange-800 mb-1">Dominant Groups</h4>
<p className="text-orange-700 text-sm">{world.inhabitants?.dominant_groups}</p>
</div>
<div className="p-3 bg-orange-50 rounded-lg">
<h4 className="font-semibold text-orange-800 mb-1">Relationships</h4>
<p className="text-orange-700 text-sm">{world.inhabitants?.relationships}</p>
</div>
<div className="p-3 bg-orange-50 rounded-lg">
<h4 className="font-semibold text-orange-800 mb-1">Notable Figures</h4>
<p className="text-orange-700 text-sm">{world.inhabitants?.notable_figures}</p>
</div>
</div>
</div>
</div>
</div>
</div>
);
};

return (
<section className="px-6 py-20 font-serif text-softBrown bg-gradient-to-b from-transparent to-cream-100/30 min-h-screen">
{/* Navigation Header */}
<div className="max-w-7xl mx-auto mb-8">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
<Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
<div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
<span className="text-white font-serif font-bold text-sm">SN</span>
</div>
<span className="text-xl font-serif font-bold text-softBrown">The Story Nook</span>
</Link>
<span className="text-warmGray font-serif">/ World Maker</span>
</div>

<div className="flex items-center space-x-3">
<Link href="/dashboard">
<Button variant="ghost" size="sm" className="text-warmGray hover:text-softBrown">
<Globe className="w-4 h-4 mr-2" />
Dashboard
</Button>
</Link>
<Button
onClick={() => setViewMode('create')}
variant={viewMode === 'create' ? 'default' : 'ghost'}
size="sm"
className={viewMode === 'create' ? 'bg-peach-500 text-white' : 'text-warmGray hover:text-softBrown'}
>
<Plus className="w-4 h-4 mr-2" />
Create
</Button>
<Link href="/">
<Button variant="ghost" size="sm" className="text-warmGray hover:text-softBrown font-serif">
<Home className="w-4 h-4 mr-2" />
Home
</Button>
</Link>
</div>
</div>
</div>

{viewMode === 'create' && renderCreateMode()}
{viewMode === 'view' && renderViewMode()}
</section>
);
}
