import { Sparkles, Lightbulb, Tag } from "lucide-react";
import type { AIStyleTips } from "@/lib/ai/schemas";

/**
 * Muestra tips de estilo generados por IA en la página de detalle de producto.
 * Este componente solo se renderiza si la IA devolvió tips válidos.
 */
export function AIStyleTipsCard({ tips }: { tips: AIStyleTips }) {
  const hasContent =
    tips.style_tip || tips.occasion || tips.combination_ideas.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="ai-card overflow-hidden rounded-2xl border border-lama-line bg-lama-card">
      <div className="flex items-center gap-2 border-b border-lama-line/50 px-5 py-3">
        <Sparkles className="h-4 w-4 text-lama-detail" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-wider text-lama-detail">
          Tips de estilo · IA
        </p>
      </div>
      <div className="space-y-4 p-5">
        {tips.style_tip ? (
          <div className="flex gap-3">
            <Lightbulb
              className="mt-0.5 h-4 w-4 shrink-0 text-lama-detail"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed">{tips.style_tip}</p>
          </div>
        ) : null}

        {tips.occasion ? (
          <div className="flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-lama-detail" aria-hidden="true" />
            <span className="rounded-full bg-lama-detail/10 px-3 py-1 text-xs font-bold text-lama-detail">
              {tips.occasion}
            </span>
          </div>
        ) : null}

        {tips.combination_ideas.length > 0 ? (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-lama-ink/50">
              Ideas de combinación
            </p>
            <ul className="space-y-1.5">
              {tips.combination_ideas.map((idea, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lama-detail" />
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
