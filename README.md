# Ramenchatbot
🍜 Ramen Sensei — AI Cooking Experience

An immersive AI-powered ramen cooking experience where users don’t just get recipes… they feel the cooking.

From selecting your ramen style to watching it come alive with animations, sounds, and interactive steps — this is not just a chatbot, it's a culinary simulation.


✨ Features
🎴 Ramen Selection Cards (Weapon System)
Choose from:
Tonkotsu
Miso
Shoyu
Veg
Each selection triggers AI + animation

🤖 AI Chef (Ramen Sensei)
Generates full recipes with:
Ingredients
Step-by-step cooking instructions
Smart cuisine mapping:
Korean → Miso/Shoyu
Chinese → Shoyu
Indian Fusion → Veg/Miso

🎬 Cooking Simulation
Real-time stages:
Boiling 🔥
Ingredients 🥬
Noodles 🍜
Plating 🍥
Animated bowl + steam + toppings

💬 Interactive Chat UI
Suggested prompts
Smooth scrolling
Typing animation

🎨 Dynamic Themes
UI changes based on ramen type
Glow + color transitions

🧠 AI System
Model: llama-3.1-8b-instant (via Groq API)
Structured JSON response system:
{
  "answer": "Recipe",
  "message": "Chef line",
  "facts": [],
  "ramen": {
    "type": "",
    "spice": "",
    "stage": ""
  }
}


🛠️ Tech Stack
Frontend: React / Next.js
Backend: API Routes (Node.js)
AI: Groq (OpenAI-compatible API)
Styling: Tailwind CSS
Animations: CSS + Video Assets
Audio: Custom Sound Manager

⚙️ How It Works
User selects ramen from cards
Selection triggers structured AI request
Backend sends prompt to AI
AI returns:
Recipe
Cooking stage
Metadata
UI:
Displays answer
Plays animation
Updates cooking simulation

📦 Installation
git clone https://github.com/your-username/ramen-sensei.git
cd ramen-sensei
npm install
npm run dev

🔑 Environment Variables
Create a .env.local file:
GROQ_API_KEY=your_api_key_here


👉 Include:

Ramen selection
AI response (full recipe)
Cooking animation
Sound effects
💡 Special Touch

If traditional ramen noodles are unavailable:

You can use Maggi, instant noodles, or any local noodles — the AI adapts recipes accordingly.

🚀 Future Improvements
Ingredient customization mode
Voice interaction
Multi-language support
Save favorite recipes
AR cooking mode 👀


 Live webapp link:-   https://ramenchatbot-1wtdpykmg-astha-s-projects-35d28306.vercel.app/
 
🧑‍🍳 Author
Astha Singh
🌟 Inspiration

Inspired by blending:

Food + AI
UI/UX storytelling
Interactive simulations
