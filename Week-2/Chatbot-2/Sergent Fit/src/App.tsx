import React, { useState, useEffect } from "react";
import { UserProfile, Message, WorkoutLog } from "./types";
import OnboardingForm from "./components/OnboardingForm";
import ProfilePanel from "./components/ProfilePanel";
import WorkoutPlanner from "./components/WorkoutPlanner";
import PerformanceLogs from "./components/PerformanceLogs";
import MovementManual from "./components/MovementManual";
import ChatWindow from "./components/ChatWindow";
import { Shield, Sparkles, AlertTriangle, Calendar, MessageSquare, BookOpen, Clock, Activity } from "lucide-react";

const INITIAL_GREETING = `Listen up, Recruit. I'm Sergeant Fit — your assigned fitness officer. We're going to build you from the ground up. No shortcuts, no skipped days, no whining.

Before I draw up your plan, I need intel. Answer these questions and answer them straight:

1. What does your average weekday look like — work hours, commute, wake time?
2. Which days of the week are your heaviest at work?
3. Any injuries, pain points, or physical limitations I need to know about?
4. Do you have access to a gym, or are we working with bodyweight at home?

The clock is ticking. Report.`;

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("sergeant_fit_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [logs, setLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem("sergeant_fit_logs");
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("sergeant_fit_chat");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "initial",
        role: "model",
        content: INITIAL_GREETING,
        timestamp: new Date().toISOString()
      }
    ];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "roster" | "manual">("chat");

  // Keep a dynamic UTC Clock for military precision
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (profile) {
      localStorage.setItem("sergeant_fit_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("sergeant_fit_profile");
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("sergeant_fit_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("sergeant_fit_chat", JSON.stringify(messages));
  }, [messages]);

  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    
    // Inject custom onboarding confirmation to messages
    const onboardingText = `ONBOARDING SUBMISSION DOSSIER COMPLETED:\n- Name: ${newProfile.name}\n- Destination Mode: ${newProfile.location === "home" ? "HOME-BOUND" : "GYM-DEPLOYED"}\n- Profile Wake/Sleep: ${newProfile.wakeTime} / ${newProfile.bedTime}\n- Office Hours: ${newProfile.workHours} | Commute: ${newProfile.commuteHours}\n- High Meetings Demands: ${newProfile.heavyDays.join(", ") || "None"}\n- Injuries Listed: ${newProfile.limitations}`;
    
    const introPrompt = `Sergeant, I have submitted my induction dossier. Here is my context block:\n${onboardingText}\n\nFormulate my structured weekly tactical workout plan based on my profile, and confirm you have locked it in. State my rank and direct orders!`;
    
    // Auto-trigger plan generation
    handleSendMessage(introPrompt);
  };

  const handleSendMessage = async (userText: string) => {
    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: userText,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          profile: profile
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Communication failure at base level.");
      }

      const data = await res.json();
      const modelMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        content: data.reply || "Transmission received silently. Drop and do the work.",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Uplink failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetProfile = () => {
    if (window.confirm("WARNING: Are you sure you want to reset your induction dossier? This will wipe your profile context.")) {
      setProfile(null);
      localStorage.removeItem("sergeant_fit_profile");
      setMessages([
        {
          id: "initial",
          role: "model",
          content: INITIAL_GREETING,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const handleWipeHistory = () => {
    if (window.confirm("WIPE PROTOCOL: Are you sure you want to delete all historical session logs?")) {
      setLogs([]);
    }
  };

  const handleAddLog = (newLog: WorkoutLog) => {
    setLogs((prev) => [...prev, newLog]);
    
    // Auto post confirmation report trigger to Sergeant chat!
    const statusNote = newLog.type === "Skip" 
      ? `Sergeant! I logged a SKIPPED DAY on ${newLog.date}. I failed to execute the daily duty.` 
      : `Sergeant! I successfully executed my daily routine on ${newLog.date}. I did ${newLog.duration} minutes of ${newLog.workoutName}. ${newLog.notes ? `Details: ${newLog.notes}` : ""}`;
    
    handleSendMessage(statusNote);
  };

  const handleSelectFromOther = (promptText: string) => {
    setActiveTab("chat");
    handleSendMessage(promptText);
  };

  return (
    <div className="min-h-screen bg-bg-darkest font-sans text-text-primary flex flex-col antialiased">
      {/* Top Banner Header */}
      <header className="bg-bg-panel border-b border-border-subtle px-4 py-3 shadow-md flex justify-between items-center sm:px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-orange rounded-sm flex items-center justify-center font-black text-black text-xs uppercase">
            SF
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white leading-tight font-mono">
              Command Center: Unit 701
            </h1>
            <p className="text-[9px] text-[#6A726A] font-mono tracking-wider">
              SERGEANT FIT // TACTICAL READINESS ENGINE
            </p>
          </div>
        </div>

        {/* Tactical status clocks */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-[#6A726A] font-black uppercase tracking-tighter">System Status</span>
            <span className="text-[10px] sm:text-xs font-mono text-brand-green">ACTIVE // NO_SKIPS_ENGAGED</span>
          </div>
          <div className="h-8 w-[1px] bg-border-subtle hidden sm:block"></div>
          <div className="hidden sm:block text-right font-mono text-xs text-stone-300 uppercase">
            {utcTime.replace("UTC", "Zulu") || "09:42 Zulu"}
          </div>
        </div>
      </header>

      {/* Main body / App domain */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-start">
        {!profile ? (
          <div className="my-auto py-10">
            <OnboardingForm onComplete={handleCompleteOnboarding} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
            {/* Left Column Dossier / Metrics Summary (4 cols) */}
            <section className="lg:col-span-4 space-y-6">
              <ProfilePanel profile={profile} onReset={handleResetProfile} />
              <PerformanceLogs logs={logs} onWipeHistory={handleWipeHistory} />
            </section>

            {/* Right Column Interactive controls (8 cols) */}
            <section className="lg:col-span-8 bg-bg-panel border border-border-subtle rounded-sm shadow-xl overflow-hidden flex flex-col min-h-[580px]">
              {/* Tab selector bar */}
              <div className="flex border-b border-border-subtle bg-bg-darkest">
                <button
                  id="tab-chat"
                  type="button"
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 py-3.5 px-3 font-mono text-[11px] uppercase tracking-wider font-bold border-r border-border-subtle flex items-center justify-center gap-2 transition-all ${
                    activeTab === "chat"
                      ? "bg-bg-panel text-brand-green border-b-2 border-b-brand-green"
                      : "text-text-muted hover:text-stone-300"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Tactical Chat
                </button>
                <button
                  id="tab-roster"
                  type="button"
                  onClick={() => setActiveTab("roster")}
                  className={`flex-1 py-3.5 px-3 font-mono text-[11px] uppercase tracking-wider font-bold border-r border-border-subtle flex items-center justify-center gap-2 transition-all ${
                    activeTab === "roster"
                      ? "bg-bg-panel text-brand-green border-b-2 border-b-brand-green"
                      : "text-text-muted hover:text-stone-300"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Duty Roster Plan
                </button>
                <button
                  id="tab-manual"
                  type="button"
                  onClick={() => setActiveTab("manual")}
                  className={`flex-1 py-3.5 px-3 font-mono text-[11px] uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === "manual"
                      ? "bg-bg-panel text-brand-green border-b-2 border-b-brand-green"
                      : "text-text-muted hover:text-stone-300"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Field Manual
                </button>
              </div>

              {/* Tab implementation viewports */}
              <div className="flex-1 p-4 lg:p-6 bg-bg-panel relative">
                {activeTab === "chat" && (
                  <div className="h-[520px]">
                    <ChatWindow
                      messages={messages}
                      loading={loading}
                      onSendMessage={handleSendMessage}
                      error={error}
                    />
                  </div>
                )}

                {activeTab === "roster" && (
                  <WorkoutPlanner
                    profile={profile}
                    logs={logs}
                    onAddLog={handleAddLog}
                    onQuickWorkoutSelect={handleSelectFromOther}
                  />
                )}

                {activeTab === "manual" && (
                  <MovementManual onSelectExercise={handleSelectFromOther} />
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer disclaimer lines */}
      <footer className="bg-bg-darkest border-t border-border-subtle py-3 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-text-muted gap-2.5">
        <div className="flex gap-6">
          <span>ENCRYPTION: AES-256-GCM</span>
          <span>LATENCY: 14MS</span>
        </div>
        <div className="text-center opacity-85">
          SERGEANT FIT PROTOCOL // ZERO SKIPS TOLERATED // EXERCISE AT YOUR OWN PHYSICAL DISCRETION
        </div>
        <div>
          © 2026 FIT_COMMAND // NO EXCUSES
        </div>
      </footer>
    </div>
  );
}
