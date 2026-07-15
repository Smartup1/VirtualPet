export type PetMood = "happy" | "neutral" | "sad" | "sleeping" | "eating";

export interface PetStats {
  hunger: number; // 0-100 (100 = totalmente alimentado)
  happiness: number; // 0-100
  sleep: number; // 0-100 (100 = totalmente descansado)
  hygiene: number; // 0-100
}

export interface PetProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface Wallet {
  coins: number;
  gems: number;
}

export interface PetState {
  name: string;
  stats: PetStats;
  progress: PetProgress;
  wallet: Wallet;
  mood: PetMood;
  lastUpdatedAt: number; // timestamp usado para calcular decaimento offline
}

export type PetAction = "feed" | "play" | "sleep" | "bathe" | "pet";
