"use client";

import { useState } from "react";
import { categories, Category } from "@/data/categories";
import CodeBlock from "@/components/CodeBlock";
import Checklist from "@/components/Checklist";
import CollapsibleSection from "@/components/CollapsibleSection";
import TalkTrack from "@/components/TalkTrack";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected: Category | undefined = categories.find(
    (c) => c.id === selectedId
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          GenAI Zurich 2026
        </h1>
        <p className="mt-1 text-lg text-gray-600">
          Agentic AI in Action: How to Automate a Process in 1 Hour
        </p>
        <p className="mt-1 text-sm text-gray-400">1 April 2026</p>
      </header>

      {/* Category Selector */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Choose a demo category
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedId(cat.id)}
              className={`text-left p-5 rounded-lg border-2 transition-colors ${
                selectedId === cat.id
                  ? "border-gray-900 bg-white"
                  : "border-gray-200 bg-white hover:border-gray-400"
              }`}
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-gray-900">{cat.name}</div>
              <div className="text-sm text-gray-500">{cat.subtitle}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Category Content */}
      {selected && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {selected.icon} {selected.name}
          </h2>
          <p className="text-sm text-gray-500 mb-6">{selected.subtitle}</p>

          <div className="border border-gray-200 rounded-lg bg-white">
            {selected.acts.map((act, i) => (
              <CollapsibleSection
                key={act.title}
                title={act.title}
                defaultOpen={i === 0}
              >
                <Checklist items={act.checklist} />
                <CodeBlock code={act.prompt} language={act.promptLabel} />
                <TalkTrack text={act.talkTrack} />
              </CollapsibleSection>
            ))}

            {/* Resources */}
            <CollapsibleSection title="Resources" defaultOpen={false}>
              <ul className="space-y-2 my-3">
                {selected.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline underline-offset-2"
                    >
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </div>
        </section>
      )}
    </main>
  );
}
