"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hola! Soy el asistente de LAMA. Puedo ayudarte a encontrar prendas y resolver dudas de talles o estilo. En que te puedo ayudar?"
};

const limitReachedMessage = "Limite de consultas alcanzado";

function createMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function MessageContent({ content }: { content: string }) {
  const productPathPattern = /\/productos\/[A-Za-z0-9_-]+/g;
  const parts = content.split(productPathPattern);
  const paths = content.match(productPathPattern) ?? [];

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {paths[index] ? (
            <Link
              href={paths[index]}
              className="font-bold text-lama-detail underline underline-offset-2 hover:text-lama-ink"
            >
              Ver producto
            </Link>
          ) : null}
        </span>
      ))}
    </>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedInput
    };
    const assistantMessage: ChatMessage = {
      id: createMessageId(),
      role: "assistant",
      content: ""
    };
    const requestMessages = [...messages, userMessage].map(({ role, content }) => ({
      role,
      content
    }));

    setMessages((currentMessages) => [...currentMessages, userMessage, assistantMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages })
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "No se pudo conectar con el asistente.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        assistantContent += decoder.decode(value, { stream: true });
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: assistantContent }
              : message
          )
        );
      }
    } catch (caughtError) {
      const fallbackMessage =
        caughtError instanceof Error ? caughtError.message : "Error al conectar con el asistente.";
      const assistantFallbackMessage =
        fallbackMessage === limitReachedMessage
          ? limitReachedMessage
          : "No pude responder ahora. Proba de nuevo en un momento.";

      setError(fallbackMessage === limitReachedMessage ? null : fallbackMessage);
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content: assistantFallbackMessage
              }
            : message
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-widget-toggle"
        aria-label={isOpen ? "Cerrar chat" : "Abrir asistente de LAMA"}
        id="chat-toggle"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen ? (
        <div className="chat-widget-panel" role="dialog" aria-label="Asistente de LAMA">
          <div className="chat-widget-header">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Lama Assistant</p>
                <p className="text-[11px] opacity-70">Asistente de compras con IA</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/20"
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="chat-widget-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.role === "user" ? "chat-message-user" : "chat-message-assistant"}`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    message.role === "user"
                      ? "bg-lama-detail text-white"
                      : "bg-lama-line/60 text-lama-ink"
                  }`}
                >
                  {message.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                </div>
                <div
                  className={`whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-lama-detail text-white"
                      : "bg-lama-card text-lama-ink"
                  }`}
                >
                  {message.content ? (
                    <MessageContent content={message.content} />
                  ) : (
                    <span className="inline-flex items-center gap-2 text-lama-ink/60">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Pensando...
                    </span>
                  )}
                </div>
              </div>
            ))}
            {error ? (
              <div className="mx-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-widget-input">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribi tu mensaje..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-lama-ink/40"
              disabled={isLoading}
              maxLength={2000}
              id="chat-input"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lama-detail text-white transition-all hover:bg-lama-ink disabled:opacity-40 disabled:hover:bg-lama-detail"
              aria-label="Enviar mensaje"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
