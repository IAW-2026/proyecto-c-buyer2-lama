import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Cliente de Google Gemini configurado con la API key del entorno.
 * Se usa `gemini-2.0-flash` por ser gratuito, rápido y con buen soporte
 * de function calling + structured output.
 */

const geminiApiKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY ?? "";

const google = createGoogleGenerativeAI({
  apiKey: geminiApiKey
});

export const geminiModel = google("gemini-2.0-flash");

export function isAIConfigured() {
  return Boolean(geminiApiKey);
}
