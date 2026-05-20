import React, { useState } from "react";
import { UserProfile } from "../types";
import { Shield, Clock, Compass, Activity } from "lucide-react";

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function OnboardingForm({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [wakeTime, setWakeTime] = useState("06:00");
  const [bedTime, setBedTime] = useState("22:00");
  const [workHours, setWorkHours] = useState("09:00 - 17:00");
  const [commuteHours, setCommuteHours] = useState("1 hour");
  const [heavyDays, setHeavyDays] = useState<string[]>([]);
  const [limitations, setLimitations] = useState("");
  const [location, setLocation] = useState<"home" | "gym">("home");

  const toggleDay = (day: string) => {
    setHeavyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const finalProfile: UserProfile = {
        name: name.trim() || "Recruit",
        wakeTime,
        bedTime,
        workHours,
        commuteHours,
        heavyDays,
        limitations: limitations.trim() || "None reported",
        location,
        completedOnboarding: true,
      };
      onComplete(finalProfile);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-bg-panel border border-border-subtle rounded-sm p-6 shadow-2xl font-sans text-text-primary">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-brand-orange" />
          <h2 className="font-mono text-sm uppercase tracking-wider text-brand-orange font-bold">
            Tactical Induction Sequence
          </h2>
        </div>
        <div className="font-mono text-xs text-text-muted bg-bg-darkest px-2.5 py-1 border border-border-subtle rounded-sm">
          PHASE {step} / 4
        </div>
      </div>

      {/* Intro Context banner */}
      {step === 1 && (
        <div className="bg-bg-darkest p-4 border-l-2 border-brand-orange rounded-sm mb-6 text-stone-300 text-sm leading-relaxed">
          <span className="font-bold text-brand-orange font-mono">SERGEANT FIT INSTRUCTIONS:</span>
          {" 'Listen up, Recruit. I'm Sergeant Fit — your assigned fitness officer. We're going to build you from the ground up. No shortcuts, no skipped days, no whining. Before I draw up your plan, I need intel. Stand fast and report.'"}
        </div>
      )}

      {/* Steps Content */}
      <div className="space-y-6 min-h-[220px]">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-mono text-base font-bold text-stone-100 uppercase tracking-wide flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-green" />
              Identify Yourself
            </h3>
            <div>
              <label className="block font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">
                What is your name, Recruit? (leave blank to be called 'Recruit')
              </label>
              <input
                id="onboarding-name-input"
                type="text"
                placeholder="Last name, First name or Alias"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-darkest border border-border-subtle rounded-sm px-3 py-2 text-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-green font-mono text-sm placeholder:text-stone-600"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">
                Primary Workout Domain
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  id="domain-home-btn"
                  type="button"
                  onClick={() => setLocation("home")}
                  className={`border p-3.5 rounded-sm text-left transition-all ${
                    location === "home"
                      ? "border-brand-orange bg-[#D97706]/10 text-white font-bold"
                      : "border-border-subtle bg-bg-darkest text-text-muted hover:text-stone-300 hover:border-stone-700"
                  }`}
                >
                  <p className="font-mono font-bold text-xs uppercase tracking-wider">HOME BOUND</p>
                  <p className="text-[10px] opacity-80 mt-1 text-stone-400">Bodyweight only. Zero equipment. 100% grit.</p>
                </button>
                <button
                  id="domain-gym-btn"
                  type="button"
                  onClick={() => setLocation("gym")}
                  className={`border p-3.5 rounded-sm text-left transition-all ${
                    location === "gym"
                      ? "border-brand-orange bg-[#D97706]/10 text-white font-bold"
                      : "border-border-subtle bg-bg-darkest text-text-muted hover:text-stone-300 hover:border-stone-700"
                  }`}
                >
                  <p className="font-mono font-bold text-xs uppercase tracking-wider">GYM DEPLOYED</p>
                  <p className="text-[10px] opacity-80 mt-1 text-stone-400">Access to weights, barbells and cardio gear.</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-mono text-base font-bold text-stone-100 uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-green" />
              Sentry Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">
                  Wake-Up Time (Weekday)
                </label>
                <input
                  id="onboarding-wake-input"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full bg-bg-darkest border border-border-subtle rounded-sm px-3 py-2 text-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-green font-mono"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">
                  Bedtime (Weekday)
                </label>
                <input
                  id="onboarding-bed-input"
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="w-full bg-bg-darkest border border-border-subtle rounded-sm px-3 py-2 text-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-green font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">
                  Standard Work Hours
                </label>
                <input
                  id="onboarding-work-input"
                  type="text"
                  placeholder="e.g. 09:00 - 18:00"
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  className="w-full bg-bg-darkest border border-border-subtle rounded-sm px-3 py-2 text-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-green font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">
                  Daily Commute (approx)
                </label>
                <input
                  id="onboarding-commute-input"
                  type="text"
                  placeholder="e.g. 1 hour, or None"
                  value={commuteHours}
                  onChange={(e) => setCommuteHours(e.target.value)}
                  className="w-full bg-bg-darkest border border-border-subtle rounded-sm px-3 py-2 text-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-green font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-mono text-base font-bold text-stone-100 uppercase tracking-wide flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-green" />
              Heavy Workloads
            </h3>
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider leading-relaxed">
              CHOOSE THE DAYS THAT DEMAND HEAVY MEETING LOADS OR OVERTIME HOURS. THESE ARE CLASSIFIED AS BUSY DAYS.
            </p>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => {
                const active = heavyDays.includes(day);
                return (
                  <button
                    id={`day-select-${day}`}
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-sm font-mono text-xs border transition-colors ${
                      active
                        ? "bg-[#D97706]/20 border-brand-orange text-white font-bold"
                        : "bg-bg-darkest border-border-subtle text-text-muted hover:text-stone-300 hover:border-stone-700"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-text-muted font-mono">
              Selected busy days automatically inherit custom tiered 10-minute fitness workouts.
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-mono text-base font-bold text-stone-100 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-green" />
              Casualties & Physical Barriers
            </h3>
            <div>
              <label className="block font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">
                List any injuries, joint pains, or medical limitations (e.g. Knee soreness, Lower back stiffness)
              </label>
              <textarea
                id="onboarding-limitation-input"
                rows={3}
                placeholder="Leave blank if physically cleared. Be completely honest."
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
                className="w-full bg-bg-darkest border border-border-subtle rounded-sm px-3 py-2 text-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-green font-mono text-sm placeholder:text-stone-600 resize-none"
              />
            </div>
            <p className="text-xs text-stone-400 bg-bg-darkest p-3 border border-border-subtle rounded-sm leading-normal">
              <span className="text-brand-orange font-mono font-bold">ATTENTION:</span> Sergeant Fit will adapt exercises based on this list, guarding weak spots. Day Zero begins with posture restoration.
            </p>
          </div>
        )}
      </div>

      {/* Stepper Buttons */}
      <div className="flex justify-between items-center border-t border-border-subtle pt-4 mt-6">
        <button
          id="onboarding-back-btn"
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className={`px-4 py-2 text-xs font-mono border rounded-sm uppercase font-bold transition-all ${
            step === 1
              ? "opacity-30 cursor-not-allowed border-border-subtle text-text-muted"
              : "border-border-subtle bg-bg-darkest text-text-muted hover:bg-stone-800 hover:text-stone-200"
          }`}
        >
          Retreat (Back)
        </button>

        <button
          id="onboarding-next-btn"
          type="button"
          onClick={handleNext}
          className="px-5 py-2 text-xs font-mono border border-[#D97706]/40 bg-brand-orange hover:bg-brand-orange-hover text-black rounded-sm font-black uppercase transition-all"
        >
          {step === 4 ? "Submit Duty Report" : "Advance (Next)"}
        </button>
      </div>
    </div>
  );
}
