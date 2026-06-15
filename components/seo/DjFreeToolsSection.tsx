"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DJ_FREE_TOOL_CATEGORIES,
  DJ_FREE_TOOLS_LAST_VERIFIED,
  DJ_GEMINI_PROMPT_TEMPLATES,
} from "@/lib/data/dj-free-tools";

export default function DjFreeToolsSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyPrompt(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <section id="dj-free-tools" aria-labelledby="dj-tools-heading">
      <h2 id="dj-tools-heading" className="text-2xl font-semibold text-foreground">
        כלים חינמיים לדיג&apos;יי
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Fadr, Suno, Gemini ועוד — מסוננים לפי מה שדיג&apos;ייז באמת משתמשים בו.
        עודכן לאחרונה: {DJ_FREE_TOOLS_LAST_VERIFIED}.
      </p>

      <div className="mt-8 space-y-10">
        {DJ_FREE_TOOL_CATEGORIES.map((category) => (
          <div key={category.id}>
            <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{category.intro}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {category.tools.map((tool) => {
                const isInternal = tool.url.startsWith("/");
                const card = (
                  <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-5">
                    <h4 className="font-semibold text-foreground">{tool.name}</h4>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {tool.summary}
                    </p>
                    <p className="mt-3 text-xs">
                      <span className="font-medium text-foreground">חינם: </span>
                      <span className="text-muted-foreground">{tool.freeTier}</span>
                    </p>
                    {tool.paidNote ? (
                      <p className="mt-1 text-xs text-muted-foreground">{tool.paidNote}</p>
                    ) : null}
                    <p className="mt-3 text-xs leading-relaxed text-brand-red/90">
                      מתי PRO: {tool.whenProBetter}
                    </p>
                  </article>
                );
                return isInternal ? (
                  <Link key={tool.id} href={tool.url} className="hover:opacity-95">
                    {card}
                  </Link>
                ) : (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-95"
                  >
                    {card}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-6">
        <h3 className="text-lg font-semibold text-foreground">
          תבניות Gemini להעתקה
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          פותחים Gemini או ChatGPT, מדביקים את הטקסט וממלאים את הסוגריים המרובעים.
        </p>
        <div className="mt-4 space-y-4">
          {DJ_GEMINI_PROMPT_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-foreground">{template.title}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">{template.useCase}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyPrompt(template.id, template.prompt)}
                  className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-brand-red/40"
                >
                  {copiedId === template.id ? "הועתק" : "העתק"}
                </button>
              </div>
              <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                {template.prompt}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        מוזיקת AI (Suno, Udio) — בדקו רישוי לפני שמנגנים באירוע חי. לרמיקס מוכן לרחבה —
        <Link href="#pro-offers" className="mx-1 font-medium text-brand-red hover:underline">
          הזמינו ייצור מקצועי
        </Link>
        .
      </p>
    </section>
  );
}
