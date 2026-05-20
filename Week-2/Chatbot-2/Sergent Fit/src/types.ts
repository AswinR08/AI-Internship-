export interface UserProfile {
  name: string;
  wakeTime: string; // e.g. "06:00"
  bedTime: string;  // e.g. "22:00"
  workHours: string; // e.g. "09:00 - 17:00"
  commuteHours: string; // e.g. "1 hour"
  heavyDays: string[]; // e.g. ["Monday", "Wednesday"]
  limitations: string; // e.g. "Knee pain", "None"
  location: "home" | "gym";
  completedOnboarding: boolean;
}

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  isQuickTrigger?: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  type: "Free" | "Moderate" | "Busy" | "Skip" | "Rest";
  workoutName: string;
  duration: number; // minutes
  completed: boolean;
  notes?: string;
}

export interface Movement {
  name: string;
  category: "strength" | "cardio" | "mobility";
  target: string;
  description: string;
  formTips: string[];
}
