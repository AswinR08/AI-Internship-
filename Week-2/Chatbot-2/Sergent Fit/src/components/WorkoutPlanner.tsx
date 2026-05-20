import React, { useState } from "react";
import { UserProfile, WorkoutLog } from "../types";
import { Calendar, CheckCircle2, XCircle, Clock, AlertTriangle, Play } from "lucide-react";
import { TACTICAL_CIRCUITS } from "../data";

interface Props {
  profile: UserProfile;
  logs: WorkoutLog[];
  onAddLog: (log: WorkoutLog) => void;
  onQuickWorkoutSelect: (workoutText: string) => void;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WorkoutPlanner({ profile, logs, onAddLog, onQuickWorkoutSelect }: Props) {
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [completeNotes, setCompleteNotes] = useState<string>("");
  const [completeDuration, setCompleteDuration] = useState<number>(30);
  const [showLogForm, setShowLogForm] = useState<boolean>(false);
  const [logType, setLogType] = useState<"Complete" | "Skip" | "Rest">("Complete");
  const [checkedExercises, setCheckedExercises] = useState<Record<string, Record<number, boolean>>>({});

  // Determine workout recommendation for a day
  const getRecommendation = (day: string) => {
    const isHeavyDay = profile.heavyDays.includes(day);
    if (day === "Sunday") {
      return {
        type: "Rest",
        title: "Active Recovery & Mobility",
        duration: 15,
        desc: "Walk outdoors, joint stretches and deep posture resetting. No heavy loads.",
        details: ["Chin Tucks (10 reps)", "Glute Bridges (15 reps)", "Light walk (15 mins)"]
      };
    }
    if (isHeavyDay) {
      return {
        type: "Busy",
        title: "10-Min Home Bodyweight Circuit",
        duration: 10,
        desc: "Strictly mandatory under Sergeant's Rule #1! Posture and core stabilization.",
        details: TACTICAL_CIRCUITS.busy10.exercises
      };
    }
    if (day === "Saturday") {
      return {
        type: "Free",
        title: "60-Min Warrior Conditioning",
        duration: 60,
        desc: "Full strength conditioning or baseline cardiovascular training.",
        details: TACTICAL_CIRCUITS.full60.exercises.slice(1, 6)
      };
    }
    return {
      type: "Moderate",
      title: "30-Min Posture & Core Routine",
      duration: 30,
      desc: "Medium scale compound workout to restore posture and build baseline endurance.",
      details: TACTICAL_CIRCUITS.focused30.exercises
    };
  };

  const activeRec = getRecommendation(selectedDay);

  // Get log for the selected day in current week
  const getLogForDay = (day: string) => {
    // Look up in our logged data (matching day name in notes or date, let's look up by day)
    return logs.find((l) => l.workoutName.includes(`[${day}]`));
  };

  const activeLog = getLogForDay(selectedDay);

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    const isCompleted = logType === "Complete";
    const isRest = logType === "Rest";

    const timestamp = new Date().toISOString();
    const dayLabel = `[${selectedDay}]`;

    const newLog: WorkoutLog = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString().split("T")[0],
      type: isRest ? "Rest" : isCompleted ? (activeRec.type as any) : "Skip",
      workoutName: `${dayLabel} ${activeRec.title}`,
      duration: isCompleted ? Number(completeDuration) : isRest ? activeRec.duration : 0,
      completed: isCompleted || isRest,
      notes: isCompleted ? completeNotes.trim() : logType === "Skip" ? "Logged skip day." : "Completed Active Recovery."
    };

    onAddLog(newLog);
    setShowLogForm(false);
    setCompleteNotes("");
    setCompleteDuration(activeRec.duration);
  };

  // Skip limit checking for Rule 2 warning visible to user
  const checkSkipstreak = () => {
    // Sort logs by date descending and check if last two are skips
    const sorted = [...logs].reverse();
    const skipCount = sorted.slice(0, 2).filter(l => l.type === "Skip").length;
    return skipCount >= 2;
  };

  const isAlarmTriggered = checkSkipstreak();

  const toggleExerciseCheck = (day: string, idx: number) => {
    setCheckedExercises((prev) => {
      const dayChecks = prev[day] ? { ...prev[day] } : {};
      dayChecks[idx] = !dayChecks[idx];
      return {
        ...prev,
        [day]: dayChecks,
      };
    });
  };

  const currentDayChecks = checkedExercises[selectedDay] || {};
  const totalExercises = activeRec.details.length;
  const completedCount = activeRec.details.filter((_, i) => currentDayChecks[i]).length;
  const allChecked = totalExercises > 0 && completedCount === totalExercises;

  return (
    <div className="w-full bg-bg-panel border border-border-subtle rounded-sm p-4 sm:p-5 font-sans text-stone-300">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-orange" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-brand-orange font-bold">
            Tactical Duty Roster
          </h3>
        </div>
        {isAlarmTriggered && (
          <span className="flex items-center gap-1.5 bg-[#D97706]/15 border border-[#D97706]/40 px-2.5 py-1 rounded-sm text-brand-orange font-mono text-[9px] animate-pulse">
            <AlertTriangle className="w-3 h-3 text-brand-orange" />
            SKIP WARNING: DAY 3 LOCKED ENFORCEMENT
          </span>
        )}
      </div>

      {/* Weekday select buttons */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {WEEKDAYS.map((day) => {
          const isHeavy = profile.heavyDays.includes(day);
          const dayLog = getLogForDay(day);
          let bgClass = "bg-bg-darkest text-text-muted border-border-subtle";
          if (selectedDay === day) {
            bgClass = "bg-bg-panel border-brand-orange text-white font-bold shadow-sm";
          } else if (dayLog) {
            if (dayLog.type === "Skip") bgClass = "bg-red-950/20 text-red-400 border-red-950";
            else bgClass = "bg-bg-panel border-brand-green/30 text-brand-green";
          } else if (isHeavy) {
            bgClass = "bg-bg-darkest text-stone-300 border-brand-orange/20 border-dashed border";
          }

          return (
            <button
               id={`tab-day-${day}`}
              key={day}
              type="button"
              onClick={() => {
                setSelectedDay(day);
                setCompleteDuration(getRecommendation(day).duration);
              }}
              className={`py-1.5 rounded-sm font-mono text-[10px] text-center border transition-all ${bgClass}`}
            >
              <span className="block">{day.slice(0, 3)}</span>
              {dayLog ? (
                dayLog.type === "Skip" ? (
                  <span className="text-[8px] text-red-500 font-black">X</span>
                ) : (
                  <span className="text-[8px] text-brand-green font-black">✓</span>
                )
              ) : isHeavy ? (
                <span className="text-[7px] text-brand-orange uppercase">BUSY</span>
              ) : (
                <span className="text-[7px] text-text-muted uppercase">DUTY</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Recommendations card */}
      <div className="bg-bg-darkest rounded-sm border border-border-subtle p-4 relative">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className={`inline-block px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold tracking-wider uppercase mb-2 ${
              activeRec.type === "Busy"
                ? "bg-[#D97706]/10 text-brand-orange border border-[#D97706]/20"
                : activeRec.type === "Free"
                ? "bg-[#4ADE80]/10 text-brand-green border border-[#4ADE80]/20"
                : activeRec.type === "Rest"
                ? "bg-bg-panel text-text-muted border border-border-subtle"
                : "bg-bg-panel text-stone-300 border border-border-subtle"
             }`}>
              {activeRec.type} TIED DUTY
            </span>
            <h4 className="font-mono text-sm font-bold text-white uppercase">
              {activeRec.title}
            </h4>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              {activeRec.desc}
            </p>
          </div>
          <div className="flex items-center gap-1 text-stone-300 bg-bg-panel px-2.5 py-1 rounded-sm border border-border-subtle font-mono text-xs shrink-0">
            <Clock className="w-3.5 h-3.5 text-brand-green" />
            {activeRec.duration} MIN
          </div>
        </div>

        {/* Exercises Checklist */}
        <div className="mt-4 pt-3 border-t border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
              Interactive Drill Checklist ({completedCount}/{totalExercises})
            </p>
            {allChecked && (
              <span className="font-mono text-[9px] text-brand-green uppercase font-black animate-pulse">
                ★ SOLID DRILL READY
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {activeRec.details.map((ex, i) => {
              const isChecked = !!currentDayChecks[i];
              return (
                <button
                  id={`checklist-item-${selectedDay}-${i}`}
                  key={i}
                  type="button"
                  onClick={() => toggleExerciseCheck(selectedDay, i)}
                  className={`w-full flex items-start gap-3 p-2 bg-bg-panel/30 border rounded-sm text-left font-mono text-xs transition-all ${
                    isChecked
                      ? "bg-[#4ADE80]/5 border-brand-green/35 text-stone-100"
                      : "border-border-subtle text-stone-300 hover:border-brand-green/20 hover:text-stone-150"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isChecked
                      ? "bg-brand-green border-brand-green text-black"
                      : "border-border-subtle bg-bg-darkest"
                  }`}>
                    {isChecked && <span className="text-[9px] font-black leading-none">✓</span>}
                  </span>
                  <div className="flex-1 leading-normal text-xs font-mono">
                    <span className={`mr-1 font-bold ${isChecked ? 'text-brand-green' : 'text-text-muted'}`}>{i + 1}.</span>
                    <span className={isChecked ? "line-through opacity-55 text-text-muted" : "text-stone-200"}>{ex}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action controls */}
        <div className="mt-4 pt-3 border-t border-border-subtle flex flex-wrap gap-2 items-center justify-between">
          <button
            id={`ask-about-${selectedDay}`}
            type="button"
            onClick={() => {
              const prompt = `Sergeant, I need explicit exercise form instructions and strategy for my ${selectedDay} workout plan: ${activeRec.title}. Direct me!`;
              onQuickWorkoutSelect(prompt);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-bg-panel hover:bg-stone-800 border border-border-subtle text-stone-300 rounded-sm font-mono text-[10px] uppercase font-bold transition-colors"
          >
            <Play className="w-3 h-3 text-brand-orange fill-current" />
            Request Briefing on Daily Form
          </button>

          {!activeLog ? (
            <div className="flex gap-2">
              {completedCount > 0 && (
                <button
                  id={`confirm-quick-complete-${selectedDay}`}
                  type="button"
                  onClick={() => {
                    const timestamp = new Date().toISOString();
                    const dayLabel = `[${selectedDay}]`;
                    const newLog: WorkoutLog = {
                      id: Math.random().toString(36).substring(7),
                      date: new Date().toISOString().split("T")[0],
                      type: activeRec.type as any,
                      workoutName: `${dayLabel} ${activeRec.title}`,
                      duration: activeRec.duration,
                      completed: true,
                      notes: `Completed daily tactical routine. Interactive checklist verified (${completedCount}/{totalExercises} items checked).`
                    };
                    onAddLog(newLog);
                  }}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase font-bold border transition-colors rounded-sm flex items-center gap-1.5 ${
                    allChecked
                      ? "bg-brand-green text-black border-brand-green hover:bg-brand-green-hover cursor-pointer font-black"
                      : "bg-[#4ADE80]/10 text-brand-green border-brand-green/30 hover:bg-[#4ADE80]/20"
                  }`}
                >
                  Confirm Completion ({completedCount}/{totalExercises})
                </button>
              )}
              <button
                id={`log-session-${selectedDay}`}
                type="button"
                onClick={() => {
                  setLogType(activeRec.type === "Rest" ? "Rest" : "Complete");
                  setShowLogForm(true);
                }}
                className="px-4 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-black font-black rounded-sm font-mono text-[10px] uppercase transition-colors"
              >
                Log Status
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-bg-panel border border-border-subtle px-3 py-1.5 rounded-sm">
              {activeLog.type === "Skip" ? (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="font-mono text-[10px] text-red-400 uppercase font-black">Logged Skip</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-brand-green" />
                  <span className="font-mono text-[10px] text-brand-green uppercase font-bold">Logged Completed</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Embedded Log Form */}
      {showLogForm && (
        <div className="fixed inset-0 z-50 bg-[#0F1110]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-panel border border-border-subtle rounded-sm p-5 max-w-sm w-full font-mono text-stone-200 shadow-2xl">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-orange border-b border-border-subtle pb-2 mb-4 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-orange" /> Log Duty: {selectedDay}
            </h4>
            <form onSubmit={handleSubmitLog} className="space-y-4">
              {activeRec.type !== "Rest" ? (
                <div>
                  <label className="block text-[10px] text-text-muted uppercase mb-2">Completion Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="log-choice-complete"
                      type="button"
                      onClick={() => setLogType("Complete")}
                      className={`py-1.5 border rounded-sm text-xs uppercase font-bold transition-colors ${
                        logType === "Complete"
                          ? "bg-[#4ADE80]/10 border-brand-green text-brand-green font-bold"
                          : "bg-bg-darkest border-border-subtle text-text-muted"
                      }`}
                    >
                      Completed
                    </button>
                    <button
                      id="log-choice-skip"
                      type="button"
                      onClick={() => setLogType("Skip")}
                      className={`py-1.5 border rounded-sm text-xs uppercase font-bold transition-colors ${
                        logType === "Skip"
                          ? "bg-red-950/40 border-red-800 text-red-400 font-bold"
                          : "bg-bg-darkest border-border-subtle text-text-muted"
                      }`}
                    >
                      Skipped
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-bg-darkest p-2.5 rounded-sm border border-border-subtle text-[11px] text-text-muted">
                  Sunday is scheduled active recovery. This will register as Active Recovery.
                </div>
              )}

              {logType === "Complete" && (
                <>
                  <div>
                    <label className="block text-[10px] text-text-muted uppercase mb-1">Duration (Min)</label>
                    <input
                      id="log-duration-input"
                      type="number"
                      value={completeDuration}
                      onChange={(e) => setCompleteDuration(Number(e.target.value))}
                      className="w-full bg-bg-darkest border border-border-subtle rounded-sm px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-text-muted uppercase mb-1">Session Notes</label>
                    <textarea
                      id="log-notes-input"
                      rows={2}
                      placeholder="e.g. Completed with strict form. Core is tight!"
                      value={completeNotes}
                      onChange={(e) => setCompleteNotes(e.target.value)}
                      className="w-full bg-bg-darkest border border-border-subtle rounded-sm px-2.5 py-1 text-xs text-stone-205 focus:outline-none focus:ring-1 focus:ring-brand-green resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  id="log-form-cancel"
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  className="px-3 py-1.5 border border-border-subtle text-text-muted rounded-sm text-xs uppercase font-bold hover:bg-stone-800 hover:text-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="log-form-submit"
                  type="submit"
                  className="px-4 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-black rounded-sm text-xs uppercase font-black transition-colors"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
