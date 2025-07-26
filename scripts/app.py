from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure OpenAI (you'll need to set your API key)
# openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to The Story Nook API",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/character-generator', methods=['POST'])
def generate_character():
    try:
        data = request.get_json()
        character_type = data.get('type', 'protagonist')
        genre = data.get('genre', 'fantasy')
        
        # Mock character data (replace with actual AI generation)
        character = {
            "name": "Elara Moonwhisper",
            "age": 28,
            "occupation": "Herbalist",
            "personality": "Gentle yet determined, with a deep connection to nature",
            "backstory": "Raised by forest spirits after her village was destroyed",
            "appearance": "Silver hair that shimmers like moonlight, emerald green eyes",
            "skills": ["Potion brewing", "Plant identification", "Animal communication"],
            "flaws": ["Trusts too easily", "Fears large crowds"],
            "goals": "To restore balance between the human and spirit worlds"
        }
        
        return jsonify({
            "success": True,
            "character": character,
            "generated_at": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/world-builder', methods=['POST'])
def build_world():
    try:
        data = request.get_json()
        world_type = data.get('type', 'fantasy')
        setting = data.get('setting', 'medieval')
        
        # Mock world data (replace with actual AI generation)
        world = {
            "name": "Aethermoor",
            "type": "Mystical Realm",
            "climate": "Temperate with magical seasons",
            "geography": "Rolling hills dotted with ancient stone circles",
            "culture": "Peaceful agrarian society with deep magical traditions",
            "government": "Council of Elders guided by nature spirits",
            "magic_system": "Elemental magic drawn from natural sources",
            "notable_locations": [
                "The Whispering Grove - Ancient forest of talking trees",
                "Starfall Lake - Waters that reflect other realms",
                "The Crystal Caverns - Underground city of gem miners"
            ],
            "conflicts": "Ancient darkness stirring beneath the mountains"
        }
        
        return jsonify({
            "success": True,
            "world": world,
            "generated_at": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/writing-assistant', methods=['POST'])
def writing_assistant():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        assistance_type = data.get('type', 'continue')
        
        # Mock writing assistance (replace with actual AI generation)
        suggestions = {
            "continue": [
                "The mist began to part, revealing a path she had never seen before...",
                "A gentle voice called her name from somewhere in the distance...",
                "The ancient book in her hands suddenly grew warm to the touch..."
            ],
            "improve": [
                "Consider adding more sensory details to immerse the reader",
                "This dialogue could reveal more about the character's motivation",
                "Try varying your sentence structure for better flow"
            ],
            "brainstorm": [
                "What if your character discovers a hidden talent?",
                "Consider introducing a mysterious mentor figure",
                "Perhaps there's a secret that changes everything"
            ]
        }
        
        return jsonify({
            "success": True,
            "suggestions": suggestions.get(assistance_type, suggestions["continue"]),
            "type": assistance_type,
            "generated_at": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/save-story', methods=['POST'])
def save_story():
    try:
        data = request.get_json()
        title = data.get('title', 'Untitled Story')
        content = data.get('content', '')
        author = data.get('author', 'Anonymous')
        
        # Mock save functionality (implement actual database storage)
        story_id = f"story_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return jsonify({
            "success": True,
            "story_id": story_id,
            "message": "Story saved successfully",
            "saved_at": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
