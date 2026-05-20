import React, { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { Send, Shield, AlertTriangle, Sparkles, AlertCircle } from "lucide-react";

interface Props {
  messages: Message[];
  loading: boolean;
  onSendMessage: (text: string) => void;
  error: string | null;
}

const TACTICAL_SHORTCUTS = [
  { label: "Too Busy Today", text: "Sergeant, I am too busy to work out today. Report instructions." },
  { label: "Skipped 2 Days (Alarm)", text: "Sergeant, I skipped physical training two days in a row. I need the Day 3 minimal routine." },
  { label: "10-Min Home Routine", text: "Sergeant, give me a strict 10-minute home bodyweight workout drill." },
  { label: "Fix Desk Neck Stiffness", text: "Sergeant, how do I reset my neck and back alignment after 8 hours in an office chair?" },
  { label: "Complex Medical Question (Intel)", text: "Sarge, I have a complex muscle tear symptom, is it fine to push past pain?" }
];

export default function ChatWindow({ messages, loading, onSendMessage, error }: Props) {
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const mapFormatter = (content: string) => {
    // Basic text formatter for linebreaks, bolding, lists
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Bold markings: **text** or *text*
      let cleanLine = line.replace(/\*\*(.*?)\*\//g, "$1");
      cleanLine = cleanLine.replace(/\*\*(.*?)\*\*/g, "$1");
      cleanLine = cleanLine.replace(/\*(.*?)\*/g, "$1");
      
      const isListItem = line.trim().startsWith("-") || line.trim().startsWith("*") || /^\d+\./.test(line.trim());
      const isHeading = line.trim().startsWith("#") || line.trim().toUpperCase().startsWith("SERGEANT FIT") || line.trim().toUpperCase().startsWith("MISSION BRIEFING") || line.trim().toUpperCase().startsWith("TACTICAL");

      if (isHeading) {
        return (
          <h4 key={idx} className="font-mono text-xs font-bold text-brand-green uppercase tracking-wider mt-3 mb-1">
            {cleanLine}
          </h4>
        );
      }
      if (isListItem) {
        return (
          <p key={idx} className="text-xs font-mono text-stone-200 pl-4 py-0.5 flex items-start gap-1">
            <span className="text-brand-green font-bold">•</span>
            <span>{cleanLine.replace(/^[-*]\s*/, "")}</span>
          </p>
        );
      }
      return (
        <p key={idx} className="text-xs leading-relaxed py-0.5 min-h-[1rem]">
          {cleanLine}
        </p>
      );
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-bg-panel border border-border-subtle rounded-sm overflow-hidden font-sans text-stone-300">
      {/* Thread Header */}
      <div className="bg-bg-darker px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4.5 h-4.5 text-brand-orange" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#E0E2DF] font-bold">
            COMMUNICATIONS: CONTROL TELEMETRY LINK
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
          <span className="font-mono text-[9px] text-[#4ADE80] uppercase font-black">LIVE CONSOLE</span>
        </div>
      </div>

      {/* Shortcuts drawer */}
      <div className="bg-bg-darker border-b border-border-subtle p-2.5">
        <span className="block font-mono text-[8px] text-text-muted uppercase tracking-wider mb-1.5 px-1">
          Tactical Command Presets (Click to execute)
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-[75px] overflow-y-auto pr-1">
          {TACTICAL_SHORTCUTS.map((sc, i) => (
            <button
              id={`preset-btn-${i}`}
              key={i}
              type="button"
              onClick={() => onSendMessage(sc.text)}
              className="px-2 py-1 bg-bg-panel hover:bg-bg-darkest border border-border-subtle font-mono text-[9px] text-stone-300 rounded-sm uppercase transition-colors"
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-darkest">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
            >
              <div
                className={`max-w-[85%] rounded-tr-sm rounded-br-sm rounded-bl-sm p-4 font-mono text-xs border ${
                  isUser
                    ? "bg-bg-panel border-border-subtle text-stone-100"
                    : "bg-bg-panel border-border-subtle text-stone-200"
                }`}
              >
                {/* Meta details */}
                <div className="flex justify-between items-center pb-1.5 mb-2 border-b border-border-subtle/45 opacity-60 text-[9px]">
                  <span className={`font-bold tracking-wider uppercase ${isUser ? 'text-brand-orange' : 'text-brand-green'}`}>
                    {isUser ? "REC_TRANSMIT" : "SF_OFFICER_REPLY"}
                  </span>
                  <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                {/* Clean formatted markup text */}
                <div className="space-y-1">
                  {mapFormatter(m.content)}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start w-full">
            <div className="max-w-[85%] bg-bg-panel border border-border-subtle rounded-sm p-3.5 text-xs font-mono text-brand-green shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-bounce [animation-delay:0.4s]"></span>
                <span className="animate-pulse italic uppercase tracking-wider text-[10px] text-text-muted">Analyzing strategic field guidelines...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-950/20 border border-red-950 rounded-sm p-3 flex items-center gap-2 text-xs text-red-400 font-mono">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <div>
              <p className="font-bold uppercase text-[10px]">Communications Uplink Down</p>
              <p className="text-[10px] mt-0.5 opacity-90">{error}</p>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Submit block */}
      <form onSubmit={handleSubmit} className="p-3 bg-bg-darker border-t border-border-subtle flex gap-2">
        <input
          id="chat-text-input"
          type="text"
          placeholder={loading ? "Tactical processing ongoing..." : "Speak straight, recruit... Enter intel here."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
          className="flex-1 bg-bg-panel border border-border-subtle rounded-sm px-4 py-2 text-xs font-mono text-stone-200 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-brand-green disabled:opacity-50"
        />
        <button
          id="chat-submit-btn"
          type="submit"
          disabled={loading || !inputText.trim()}
          className="px-6 py-2 bg-brand-green hover:bg-brand-green-hover disabled:opacity-30 rounded-sm text-black font-black font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          Transmit
        </button>
      </form>
    </div>
  );
}
