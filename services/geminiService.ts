import { GoogleGenAI } from "@google/genai";
import { GameMode } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDartsAdvice = async (score: number, mode: GameMode): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    let ruleDescription = '';
    switch (mode) {
      case 'double_out': ruleDescription = 'Double Out (Finish on Double or Double Bull)'; break;
      case 'master_out': ruleDescription = 'Master Out (Finish on Treble, Double, or Bull)'; break;
      case 'single_out': ruleDescription = 'Single Out (Finish on any segment)'; break;
    }

    const prompt = `
      You are a professional darts coach.
      Context:
      - Player Score: ${score}
      - Game Rule: ${ruleDescription}
      
      Provide a very short, strategic tip (max 2 sentences) for this specific rule set.
      
      Guidelines:
      - If "Single Out", encourage simple, safe targets.
      - If "Master Out", remind them they can finish on Triples if helpful.
      - If "Double Out", suggest leaving standard doubles (D20, D16).
      - If no checkout is possible (Bogey number), explain what to leave.
      
      Style: Encouraging, punchy, professional.
      Language: Japanese.
      No markdown lists.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "コーチからのアドバイスを取得できませんでした。";
  }
};