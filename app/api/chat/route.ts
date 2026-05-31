import { createTextStreamResponse, streamText, stepCountIs } from "ai";
import { geminiModel, isAIConfigured } from "@/lib/ai/config";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { chatRequestSchema } from "@/lib/ai/schemas";
import { sanitizeChatMessages } from "@/lib/ai/sanitize";
import { chatTools } from "@/lib/ai/tools";
import { checkAIRateLimit, getAIRateLimitKey } from "@/lib/ai/rate-limit";

export async function POST(request: Request) {
  const rateLimit = checkAIRateLimit({
    key: getAIRateLimitKey(request, "chat"),
    limit: 20,
    windowMs: 60_000
  });

  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Demasiados mensajes. Intenta de nuevo en unos segundos." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) }
      }
    );
  }

  if (!isAIConfigured()) {
    return Response.json(
      { error: "El asistente de IA no esta configurado. Configura GOOGLE_GENERATIVE_AI_API_KEY." },
      { status: 503 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Formato de solicitud invalido." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Mensajes invalidos.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = streamText({
      model: geminiModel,
      system: SYSTEM_PROMPT,
      messages: sanitizeChatMessages(parsed.data.messages),
      tools: chatTools,
      stopWhen: stepCountIs(3),
      maxRetries: 0
    });

    const safeTextStream = new ReadableStream<string>({
      async start(controller) {
        try {
          for await (const delta of result.textStream) {
            controller.enqueue(delta);
          }
        } catch {
          controller.enqueue(
            "No pude responder ahora porque Gemini no tiene cuota disponible para este proyecto. Revisa la cuota o billing en Google AI Studio y proba de nuevo."
          );
        } finally {
          controller.close();
        }
      }
    });

    return createTextStreamResponse({ textStream: safeTextStream });
  } catch {
    return Response.json(
      { error: "Error al procesar la solicitud del chat." },
      { status: 500 }
    );
  }
}
