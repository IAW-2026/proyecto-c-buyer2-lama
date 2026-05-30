import { z } from "zod";

/* ─── Búsqueda semántica: filtros inferidos por la IA ─── */

export const searchIntentSchema = z.object({
  search: z.string().max(120).default(""),
  categoria: z.string().max(80).nullable().default(null),
  talle: z.string().max(10).nullable().default(null),
  genero: z.string().max(20).nullable().default(null),
  precio_min: z.number().min(0).nullable().default(null),
  precio_max: z.number().min(0).nullable().default(null),
  intent_description: z.string().max(200).default("")
});

export type SearchIntent = z.infer<typeof searchIntentSchema>;

/* ─── Recomendaciones: producto rankeado por la IA ─── */

export const aiRecommendationSchema = z.object({
  producto_id: z.string().min(1),
  reason: z.string().max(200).default("")
});

export const aiRecommendationsResponseSchema = z.object({
  recommendations: z.array(aiRecommendationSchema).max(12).default([])
});

export type AIRecommendation = z.infer<typeof aiRecommendationSchema>;

/* ─── Descripción enriquecida: tips de estilo ─── */

export const aiStyleTipsSchema = z.object({
  style_tip: z.string().max(300).default(""),
  occasion: z.string().max(100).default(""),
  combination_ideas: z.array(z.string().max(150)).max(3).default([])
});

export type AIStyleTips = z.infer<typeof aiStyleTipsSchema>;

/* ─── Chat: schema para validar mensajes entrantes ─── */

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000)
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50)
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const recommendationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(12).default(6)
});
