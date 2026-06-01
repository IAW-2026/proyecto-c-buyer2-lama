import { createTextStreamResponse, streamText, stepCountIs } from "ai";
import { geminiModel, isAIConfigured } from "@/lib/ai/config";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { chatRequestSchema } from "@/lib/ai/schemas";
import { sanitizeChatMessages } from "@/lib/ai/sanitize";
import { chatTools } from "@/lib/ai/tools";
import { checkAIRateLimit, getAIRateLimitKey } from "@/lib/ai/rate-limit";
import { createCatalogSearchAnswer, isCatalogSearchRequest } from "@/lib/ai/catalog-chat";

const LIMIT_REACHED_MESSAGE = "Limite de consultas alcanzado";

function createPlainTextStreamResponse(text: string) {
  return createTextStreamResponse({
    textStream: new ReadableStream<string>({
      start(controller) {
        controller.enqueue(text);
        controller.close();
      }
    })
  });
}

export async function POST(request: Request) {
  const rateLimit = checkAIRateLimit({
    key: getAIRateLimitKey(request, "chat"),
    limit: 20,
    windowMs: 60_000
  });

  if (!rateLimit.allowed) {
    return Response.json(
      { error: LIMIT_REACHED_MESSAGE },
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

  const sanitizedMessages = sanitizeChatMessages(parsed.data.messages);
  const lastUserMessage = [...sanitizedMessages].reverse().find((message) => message.role === "user");

  try {
    if (lastUserMessage && isCatalogSearchRequest(lastUserMessage.content)) {
      const answer = await createCatalogSearchAnswer(lastUserMessage.content);
      return createPlainTextStreamResponse(answer);
    }

    const result = streamText({
      model: geminiModel,
      system: SYSTEM_PROMPT,
      messages: sanitizedMessages,
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
          controller.enqueue(LIMIT_REACHED_MESSAGE);
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
