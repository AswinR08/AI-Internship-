import { Movement } from "./types";

export const DEF_MOVEMENTS: Movement[] = [
  {
    name: "Bodyweight Squat",
    category: "strength",
    target: "Thighs & Hips (Wakes up sleepy glutes)",
    description: "Crucial movement for reverse-engineering the damage of sitting in a desk chair all day.",
    formTips: [
      "Feet shoulder-width apart, toes pointed slightly outward.",
      "Drive hips back first like sitting in an invisible low chair.",
      "Track your knees over your toes — do not let them cave inward.",
      "Descend until your thighs are parallel to the deck, then power back up."
    ]
  },
  {
    name: "Tactical Pushup",
    category: "strength",
    target: "Chest, Shoulders & Core Stabilization",
    description: "The gold standard of upper body strength. Can be modified on an incline (desk/wall) for beginners.",
    formTips: [
      "Hands placed slightly wider than shoulders, active fingers grippin' the floor.",
      "Squeeze your glutes and brace your core — your body must be a solid board.",
      "Lower your chest to the deck, elbows tucked at a 45-degree angle (no flared elbows!).",
      "Press the floor away aggressively details."
    ]
  },
  {
    name: "Glute Bridge",
    category: "mobility",
    target: "Glutes & Tight Hips (Anti-Desk posture)",
    description: "Directly combats the 'dead glutes syndome' caused by prolonged sitting.",
    formTips: [
      "Lie flat on the deck, knees bent, feet flat on the floor close to your hips.",
      "Drive through your heels to lift your hips toward the ceiling.",
      "Squeeze your glutes tightly at the apex of the exercise for 2 seconds.",
      "Do not hyper-extend your lower back; keep your ribs pulled down and core tight."
    ]
  },
  {
    name: "Bird-Dog Balance",
    category: "mobility",
    target: "Core Stabilization & Lower Back Spine safety",
    description: "Builds a bulletproof lower back and coordinates opposite limbs for posture safety.",
    formTips: [
      "Start on all fours with hands directly under shoulders, knees under hips.",
      "Brace core. Extend right arm straight ahead, left leg straight behind you.",
      "Form a single straight line from fingers to heel, holding for 2 seconds.",
      "Slowly return and repeat with opposite limbs. Keep hips completely level!"
    ]
  },
  {
    name: "Plank Hold",
    category: "strength",
    target: "Braced Core & Deep Abdominal Wall",
    description: "Teaches your core how to brace under tension — crucial for spine safety.",
    formTips: [
      "Rest on your forearms with elbows directly under your shoulders.",
      "Extend your legs behind, toes tucked, hips level with shoulders.",
      "Actively pull your belly button to your spine. Squeeze your quads and glutes.",
      "Do not let your hips sag toward the deck!"
    ]
  },
  {
    name: "Chin Tucks & Neck Retraction",
    category: "mobility",
    target: "Neck and Cervical Spine (Combats 'Tech Neck')",
    description: "Corrects forward-head posture caused by staring at monitors.",
    formTips: [
      "Sit tall or stand, looking straight ahead.",
      "Pull your head straight backwards (make a double chin) without tilting your head down.",
      "Hold the contraction at the back of the neck for 3 seconds, then release.",
      "Perform this 10 times to reset neck tension after long meetings."
    ]
  }
];

export const TACTICAL_CIRCUITS = {
  busy10: {
    name: "10-Min Home Bodyweight Circuit",
    duration: 10,
    equipment: "None",
    rounds: 3,
    exercises: [
      "Bodyweight Squats (40s work / 20s rest)",
      "Glute Bridges (40s work / 20s rest)",
      "Tactical Pushups (Incline if needed) (40s work / 20s rest)",
      "Plank Hold (40s work / 20s rest)"
    ]
  },
  focused30: {
    name: "30-Min Posture & Core routine",
    duration: 30,
    equipment: "None",
    rounds: 4,
    exercises: [
      "Bodyweight Squats (45s work / 15s rest)",
      "Tactical Pushups (45s work / 15s rest)",
      "Glute Bridges (45s work / 15s rest)",
      "Bird-Dog Balance (45s work / 15s rest)",
      "Plank Hold (45s work / 15s rest)"
    ]
  },
  full60: {
    name: "60-Min Warrior Conditioning",
    duration: 60,
    equipment: "None (Optional Light Weights / Water Bottles)",
    rounds: 5,
    exercises: [
      "Warm Up: Dynamic stretches, chin tucks (10 min)",
      "Bodyweight Squats - High volume / slow descent (4 sets of 15 reps)",
      "Tactical Pushups - Focus on deep chest (4 sets of 12 reps)",
      "Glute Bridges - Strong squeeze at top (4 sets of 15 reps)",
      "Bird-Dog Balance (4 sets of 12 reps)",
      "Plank Hold (3 sets of 45-second holds)",
      "Active recovery cool down and hip stretches (10 min)"
    ]
  }
};
