import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Cliente de Google Gemini configurado con la API key del entorno.
 * Se usa gemini-2.5-flash por defecto. Se puede sobrescribir con GEMINI_MODEL.
 */

const geminiApiKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY ?? "";
const geminiModelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

const google = createGoogleGenerativeAI({
  apiKey: geminiApiKey
});

export const geminiModel = google(geminiModelName);

export function isAIConfigured() {
  return Boolean(geminiApiKey);
}
