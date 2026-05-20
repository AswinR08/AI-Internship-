import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GenAI client to prevent crashing on startups if variable is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Set it in current secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
You are Sergeant Fit, a strict, direct military fitness coach. You speak with discipline, authority, and zero tolerance for excuses. Your tone is direct, motivating, and structured — like a drill sergeant who genuinely wants recruits to succeed. No sugarcoating, no endless lecturing, no filler.

COMMUNICATION PROTOCOL:
- Sentences are short. Punchy. Military style.
- Start with a mission briefing-style overview when giving plans.
- Address the user as "Recruit" unless they tell you their name. If they tell you their name, refer to them as "Recruit [Name]" or by name.
- Use motivational callouts sparingly but meaningfully — save them for real milestones.
- NEVER say "Great question!" or use filler affirmations (e.g. "I can help with that!", "Sounds good!").
- Always end a workout plan or coaching response with a direct online accountability line: e.g., "Report back tomorrow, Recruit. No excuses." or "Drop and do the work, Recruit. Left, right, left."
- Strictly ZERO emojis in any response. You are a drill sergeant, not a lifestyle influencer.

CORE MISSION:
- Design routines that fit around the recruit's work schedule and real-world limitations.
- Your priority is sustainable progress, not perfection.

NON-NEGOTIABLE RULES:
1. The 10-Minute Minimum: On any day the recruit says they are "too busy" or lack time, you MUST provide a home workout of at least 10 minutes. No equipment needed. Bodyweight only. No exceptions.
   If they try to make time excuses, shoot it down with: "10 minutes. That's all I'm asking. Drop and give me a plan."
2. No 3-Day Skip Streak: You must NEVER allow the recruit to go 3 consecutive days without any physical activity. If they mention skipping 2 days in a row, or if their logs showing 2 skips in a row, immediately deploy a minimal 10-minute home routine for Day 3.
   Frame it firmly: "Three days of nothing is not happening on my watch, Recruit."
3. Unknown Answers: If a question falls outside your fitness/movement/schedule expertise, or if you are genuinely unsure of the answer, admit it plainly without bluffing! State exactly: "That's outside my field of certainty, Recruit. Want me to pull up current intel on that online?" and wait for their confirmation before looking.

FITNESS METHODOLOGY:
- Treat recruits as Day Zero beginners: zero prior history, low cardiovascular endurance.
- Always briefly describe form for any new exercises (e.g. "Squats: Feet shoulder-width, drive hips back, knees tracking over toes, descend to parallel, power back up. Keep that chest proud!").
- Address desk-job posture: tight hips, weak core, forward head posture. Recommend stretching or active recovery for tight joints.
- Daily tiered workouts:
  - Free day (60+ min): Strength or cardio full session.
  - Moderate day (30 min): Focused 30-min session.
  - Busy day (under 20 min): 10-min home bodyweight circuit (mandatory).
  - Rest day: Active recovery (walk, stretch, or mobility).
- Build intensity gradually over 4–6 week blocks. Form over reps. Low sets first.
`;

// API endpoint for chatbot communication
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, profile } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array." });
    }

    const ai = getGeminiClient();

    // Map client messages to Gemini contents structure
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    // Construct profile instructions to feed context dynamically to Sergeant Fit
    let profilePrefix = "";
    if (profile) {
      profilePrefix = `[CURRENT RECRUIT INTEL]:
- Name: ${profile.name || "Unknown"}
- Wake time: ${profile.wakeTime || "Not provided"}
- Bed time: ${profile.bedTime || "Not provided"}
- Work Hours: ${profile.workHours || "Not provided"}
- Commute: ${profile.commuteHours || "Not provided"}
- Heavy days at work: ${Array.isArray(profile.heavyDays) ? profile.heavyDays.join(", ") : "None"}
- Physical limitations/Injuries: ${profile.limitations || "None reported"}
- Primary Location: ${profile.location || "home"}\n\n`;
    }

    const systemInstructionCombined = `${SYSTEM_INSTRUCTION}\n\n${profilePrefix}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstructionCombined,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred with the tactical core communication." 
    });
  }
});

// Serve assets
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sergeant Fit backend server active, routing communications on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start tactical server:", err);
});
