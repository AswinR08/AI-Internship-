import React, { useState } from "react";
import { DEF_MOVEMENTS } from "../data";
import { BookOpen, Search, ArrowRight, Activity } from "lucide-react";

interface Props {
  onSelectExercise: (name: string) => void;
}

export default function MovementManual({ onSelectExercise }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = DEF_MOVEMENTS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-bg-panel border border-border-subtle rounded-sm p-4 sm:p-5 font-sans text-stone-300">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-orange" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-brand-orange font-bold">
            Tactical Field Manual: Movement Index
          </h3>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
        <input
          id="manual-search-input"
          type="text"
          placeholder="Search movements or target muscles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-bg-darkest border border-border-subtle rounded-sm pl-9 pr-3 py-2 text-xs font-mono text-stone-200 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      {/* Grid listing */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-6 font-mono text-xs text-text-muted">
            No active movements match criteria.
          </div>
        ) : (
          filtered.map((m) => (
            <div
              key={m.name}
              className="bg-bg-darkest border border-border-subtle rounded-sm p-4 hover:border-brand-orange transition-all"
            >
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <div>
                  <h4 className="font-mono font-bold text-xs uppercase text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                    {m.name}
                  </h4>
                  <span className="block font-mono text-[9px] text-[#4ADE80] uppercase mt-0.5">
                    Target: {m.target}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-bg-panel border border-border-subtle rounded-sm text-[9px] font-mono text-stone-400 capitalize whitespace-nowrap">
                  {m.category}
                </span>
              </div>

              <p className="text-[11px] text-stone-400 leading-normal mb-2.5">
                {m.description}
              </p>

              {/* Form guidelines */}
              <div className="bg-bg-panel/60 p-2.5 rounded-sm border border-border-subtle/50">
                <span className="block font-mono text-[8px] text-text-muted uppercase tracking-widest mb-1.5">
                  Tactical Form Drills
                </span>
                <ul className="space-y-1">
                  {m.formTips.map((tip, idx) => (
                    <li key={idx} className="text-[10px] text-stone-300 flex items-start gap-1 leading-normal">
                      <span className="text-brand-green select-none">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Send to chat button */}
              <div className="flex justify-end mt-2 pt-1 border-t border-border-subtle/30">
                <button
                  id={`consult-manual-${m.name}`}
                  type="button"
                  onClick={() => {
                    onSelectExercise(`Sergeant, brief me on form & reps optimization details for: ${m.name}. Give me a short targeted command briefing!`);
                  }}
                  className="flex items-center gap-1.5 font-mono text-[8px] uppercase font-black text-brand-orange hover:text-brand-orange-hover transition-colors"
                >
                  Ask Sarge about {m.name} <ArrowRight className="w-3 h-3 text-brand-orange" />
                </button>
              </div>
            </div>
          )
          )
        )}
      </div>
    </div>
  );
}
