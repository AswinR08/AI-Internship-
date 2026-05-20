import React from "react";
import { UserProfile } from "../types";
import { Shield, Clock, Compass, Activity, Trash2, MapPin } from "lucide-react";

interface Props {
  profile: UserProfile;
  onReset: () => void;
}

export default function ProfilePanel({ profile, onReset }: Props) {
  return (
    <div className="w-full bg-bg-panel border border-border-subtle rounded-sm p-5 font-sans text-stone-300">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-orange" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-brand-orange font-bold">
            Recruit Dossier & Intel
          </h3>
        </div>
        <button
          id="profile-reset-btn"
          type="button"
          onClick={onReset}
          className="text-text-muted hover:text-red-400 font-mono text-[10px] uppercase flex items-center gap-1 transition-colors px-2 py-1 rounded-sm bg-bg-darkest border border-border-subtle"
          title="Wipe Dossier & Demote"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Reset Profile
        </button>
      </div>

      <div className="space-y-4">
        {/* Name Plate with Orange Left Border tag */}
        <div className="bg-bg-darkest p-3 rounded-sm border-l-2 border-brand-orange border-y border-r border-border-subtle flex justify-between items-center">
          <div>
            <span className="block font-mono text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
              Recruit Identity
            </span>
            <span className="font-mono text-sm font-bold text-white uppercase">
              {profile.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-bg-panel border border-border-subtle">
            <MapPin className="w-3.5 h-3.5 text-text-muted" />
            <span className="font-mono text-[10px] text-stone-300 font-bold uppercase">
              {profile.location === "home" ? "HOME-BOUND" : "GYM-DEPLOYED"}
            </span>
          </div>
        </div>

        {/* Schedule grid with tactical borders */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-darkest p-3 rounded-sm border-l-2 border-brand-green border-y border-r border-border-subtle">
            <span className="flex items-center gap-1 font-mono text-[9px] text-text-muted uppercase tracking-wider mb-1.5">
              <Clock className="w-3 h-3 text-text-muted" />
              Sentry Hours
            </span>
            <p className="text-xs font-mono text-stone-200">
              Wake: <span className="font-bold text-brand-green">{profile.wakeTime}</span>
            </p>
            <p className="text-xs font-mono text-stone-200 mt-1">
              Sleep: <span className="font-bold text-brand-green">{profile.bedTime}</span>
            </p>
          </div>
          <div className="bg-bg-darkest p-3 rounded-sm border border-border-subtle">
            <span className="flex items-center gap-1 font-mono text-[9px] text-text-muted uppercase tracking-wider mb-1.5">
              <Compass className="w-3 h-3" />
              Office & Travel
            </span>
            <p className="text-xs font-mono text-stone-200 truncate" title={profile.workHours}>
              Work: {profile.workHours}
            </p>
            <p className="text-xs font-mono text-stone-200 truncate mt-1" title={profile.commuteHours}>
              Travel: {profile.commuteHours}
            </p>
          </div>
        </div>

        {/* Heavy Load days */}
        <div className="bg-bg-darkest p-3 rounded-sm border border-border-subtle">
          <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2">
            Heavy Meeting / OT Days (Classified: Busy)
          </span>
          {profile.heavyDays.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.heavyDays.map((day) => (
                <span
                  key={day}
                  className="px-2.5 py-0.5 bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30 rounded-sm font-mono text-[10px]"
                >
                  {day}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted font-mono italic">No heavy meeting days listed.</p>
          )}
        </div>

        {/* Physical limitations */}
        <div className="bg-bg-darkest p-3 rounded-sm border border-border-subtle">
          <span className="flex items-center gap-1 font-mono text-[9px] text-[#6A726A] uppercase tracking-wider mb-1.5">
            <Activity className="w-3.5 h-3.5 text-text-muted" />
            Vulnerabilities & Limitations
          </span>
          <p className="text-xs font-mono text-stone-300 leading-normal bg-bg-panel/40 p-2 border border-border-subtle rounded-sm">
            {profile.limitations}
          </p>
        </div>
      </div>
    </div>
  );
}
