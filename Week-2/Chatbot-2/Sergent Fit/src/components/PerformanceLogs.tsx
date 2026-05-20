import React from "react";
import { WorkoutLog } from "../types";
import { Flame, RefreshCw, CheckSquare, AlertCircle, TrendingUp } from "lucide-react";

interface Props {
  logs: WorkoutLog[];
  onWipeHistory: () => void;
}

export default function PerformanceLogs({ logs, onWipeHistory }: Props) {
  // Aggregate statistics
  const totalCompleted = logs.filter((l) => l.completed).length;
  const totalSkips = logs.filter((l) => l.type === "Skip").length;
  const totalMinutes = logs.reduce((acc, current) => acc + current.duration, 0);

  // Compute Streak (number of consecutive completed or rest days at the end of sorted list)
  const computeStreak = () => {
    let streak = 0;
    const sorted = [...logs].reverse(); // newest first
    for (const log of sorted) {
      if (log.completed || log.type === "Rest") {
        streak++;
      } else if (log.type === "Skip") {
        break; // skip breaks streak
      }
    }
    return streak;
  };

  const streak = computeStreak();

  return (
    <div className="w-full bg-bg-panel border border-border-subtle rounded-sm p-5 font-sans text-stone-300">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-orange" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-brand-orange font-bold">
            Tactical Metrics & Readiness
          </h3>
        </div>
        {logs.length > 0 && (
          <button
            id="wipe-history-btn"
            type="button"
            onClick={onWipeHistory}
            className="text-text-muted hover:text-red-400 font-mono text-[9px] uppercase hover:underline"
          >
            Clear History Log
          </button>
        )}
      </div>

      {/* Grid Summary Row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {/* Total Time */}
        <div className="bg-bg-darkest p-2.5 rounded-sm border border-border-subtle text-center">
          <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-1">
            Active Drills
          </span>
          <p className="font-mono text-base font-bold text-stone-100">
            {totalMinutes} <span className="text-[10px] text-text-muted font-normal">Min</span>
          </p>
        </div>

        {/* Completed Counts */}
        <div className="bg-bg-darkest p-2.5 rounded-sm border border-border-subtle text-center">
          <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-1">
            Missions Ok
          </span>
          <p className="font-mono text-base font-bold text-brand-green flex items-center justify-center gap-0.5">
            <CheckSquare className="w-4 h-4 text-brand-green" />
            {totalCompleted}
          </p>
        </div>

        {/* Streak */}
        <div className="bg-bg-darkest p-2.5 rounded-sm border border-border-subtle text-center">
          <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-1">
            Duty Streak
          </span>
          <p className="font-mono text-base font-bold text-brand-orange flex items-center justify-center gap-0.5">
            <Flame className="w-4 h-4 text-brand-orange" />
            {streak} <span className="text-[9px] text-text-muted font-normal">Day</span>
          </p>
        </div>

        {/* Failed / Skips */}
        <div className="bg-bg-darkest p-2.5 rounded-sm border border-border-subtle text-center">
          <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-1">
            AWOL Skips
          </span>
          <p className={`font-mono text-base font-bold flex items-center justify-center gap-0.5 ${
            totalSkips > 0 ? "text-red-500" : "text-text-muted"
          }`}>
            <AlertCircle className="w-4 h-4" />
            {totalSkips}
          </p>
        </div>
      </div>

      {/* Historical List */}
      <div className="space-y-2 mt-2">
        <h4 className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-1">
          Recent Logs Output
        </h4>
        {logs.length === 0 ? (
          <div className="bg-bg-darkest/40 border border-border-subtle rounded-sm p-4 text-center font-mono text-xs text-text-muted">
            No duty logged yet. Complete workouts in the Tactical Duty Roster to build records.
          </div>
        ) : (
          <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 border border-border-subtle p-2 rounded-sm bg-bg-darkest/40">
            {[...logs].reverse().map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-2 rounded-sm border border-border-subtle bg-bg-darkest font-mono text-xs"
              >
                <div className="space-y-0.5 truncate max-w-[70%]">
                  <span className="block font-semibold text-stone-200 truncate">{log.workoutName}</span>
                  <span className="block text-[10px] text-text-muted">{log.date} {log.notes ? `| ${log.notes}` : ""}</span>
                </div>
                <div className="text-right">
                  {log.type === "Skip" ? (
                    <span className="px-1.5 py-0.5 bg-red-950/40 text-red-400 text-[10px] rounded-sm border border-red-900 uppercase font-black">
                      SKIPPED
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-bg-panel text-brand-green text-[10px] rounded-sm border border-brand-green/30 uppercase font-bold">
                      +{log.duration} MIN
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
