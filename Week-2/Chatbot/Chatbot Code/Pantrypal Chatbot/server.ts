import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const { messages, ingredients } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Bro, you gotta say something!" });
    }

    try {
      const systemInstruction = `You are PantryPal, a 22-35 year old bachelor roommate who's into cooking. 
      You're casual, enthusiastic, and talk like a friend ("bro", "trust me", etc.).
      
      RULES:
      1. Only suggest recipes using these ingredients the user has: ${ingredients.join(", ")}.
      2. If the user mentions an ingredient you don't recognize, admit it and ask them to choose another.
      3. For any recipe suggested, always flag which ingredients are running low and suggest adding them to the next grocery list at the end.
      4. Never recommend ready-to-eat or instant meals (Maggi, frozen meals, packet biryani) as the MAIN meal. They can be a side or emergency only.
      5. Recipes should be 2-3 day batch-friendly.
      6. Keep instructions simple.
      7. Format: List ingredients first, then plain numbered steps.
      
      If the user is just chatting, be the cool roommate. If they ask for recipes, follow the format strictly.`;

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction,
        },
        history: messages.slice(0, -1).map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }))
      });

      const lastMessage = messages[messages.length - 1].text;
      const response = await chat.sendMessage({ message: lastMessage });
      
      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ error: "Kitchen's on fire, bro. Try again in a bit." });
    }
  });

  app.post("/api/recipes", async (req, res) => {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Bro, I need a list of ingredients!" });
    }

    try {
      const prompt = `You are PantryPal, a bachelor roommate and foodie. 
      The user has these ingredients: ${ingredients.join(", ")}.
      Suggest 1-2 batch-friendly (lasts 2-3 days) recipes using ONLY these ingredients. 
      If you don't recognize an ingredient, say so.
      No ready-to-eat/instant meals as main dish.
      
      Output the recipes in a structured JSON format.
      Include properties: name, ingredients (list of objects with name and amount), steps (list of strings), and runningLow (list of ingredients that would likely be finished or low after this).
      End each recipe description with bachelor-style casual text like "Trust me, you'll love this bro."`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recipes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    ingredients: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          amount: { type: Type.STRING }
                        }
                      }
                    },
                    steps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    runningLow: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    comment: { type: Type.STRING }
                  },
                  required: ["name", "ingredients", "steps", "runningLow", "comment"]
                }
              }
            },
            required: ["recipes"]
          }
        }
      });

      const data = JSON.parse(response.text || '{"recipes": []}');
      res.json(data);
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Something went wrong in the kitchen, bro." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PantryPal fired up on http://localhost:${PORT}`);
  });
}

startServer();
