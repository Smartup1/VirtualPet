// src/constants/missions.ts
import { MissionActionKey } from "@ptypes/index";

export interface MissionReward {
  coins?: number;
  gems?: number;
  xp?: number;
}

export interface MissionDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionKey: MissionActionKey; // qual contador de dailyMissions.actionCounts essa missão observa
  target: number;
  reward: MissionReward;
}

// Resetadas todo dia (ver `refreshDailyMissions` na store).
// Pensadas para incentivar o jogador a fazer todas as ações básicas ao menos
// uma vez por dia, com uma meta extra de carinho.
export const DAILY_MISSIONS: MissionDefinition[] = [
  {
    id: "feed_3",
    title: "Café da manhã",
    description: "Alimente o pet 3 vezes",
    icon: "🍖",
    actionKey: "feed",
    target: 3,
    reward: { coins: 20, xp: 15 },
  },
  {
    id: "play_3",
    title: "Hora do recreio",
    description: "Brinque com o pet 3 vezes",
    icon: "🎮",
    actionKey: "play",
    target: 3,
    reward: { coins: 20, xp: 15 },
  },
  {
    id: "bathe_1",
    title: "Banho do dia",
    description: "Dê banho no pet",
    icon: "🛁",
    actionKey: "bathe",
    target: 1,
    reward: { coins: 15, xp: 10 },
  },
  {
    id: "sleep_1",
    title: "Soneca",
    description: "Coloque o pet para dormir",
    icon: "😴",
    actionKey: "sleep",
    target: 1,
    reward: { coins: 15, xp: 10 },
  },
  {
    id: "pet_5",
    title: "Muito carinho",
    description: "Dê carinho no pet 5 vezes",
    icon: "❤️",
    actionKey: "pet",
    target: 5,
    reward: { coins: 25, gems: 1, xp: 20 },
  },
];
// src/constants/missions.ts
import { MissionActionKey } from "@ptypes/index";

export interface MissionReward {
  coins?: number;
  gems?: number;
  xp?: number;
}

export interface MissionDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionKey: MissionActionKey; // qual contador de dailyMissions.actionCounts essa missão observa
  target: number;
  reward: MissionReward;
}

// Resetadas todo dia (ver `refreshDailyMissions` na store).
// Pensadas para incentivar o jogador a fazer todas as ações básicas ao menos
// uma vez por dia, com uma meta extra de carinho.
export const DAILY_MISSIONS: MissionDefinition[] = [
  {
    id: "feed_3",
    title: "Café da manhã",
    description: "Alimente o pet 3 vezes",
    icon: "🍖",
    actionKey: "feed",
    target: 3,
    reward: { coins: 20, xp: 15 },
  },
  {
    id: "play_3",
    title: "Hora do recreio",
    description: "Brinque com o pet 3 vezes",
    icon: "🎮",
    actionKey: "play",
    target: 3,
    reward: { coins: 20, xp: 15 },
  },
  {
    id: "bathe_1",
    title: "Banho do dia",
    description: "Dê banho no pet",
    icon: "🛁",
    actionKey: "bathe",
    target: 1,
    reward: { coins: 15, xp: 10 },
  },
  {
    id: "sleep_1",
    title: "Soneca",
    description: "Coloque o pet para dormir",
    icon: "😴",
    actionKey: "sleep",
    target: 1,
    reward: { coins: 15, xp: 10 },
  },
  {
    id: "pet_5",
    title: "Muito carinho",
    description: "Dê carinho no pet 5 vezes",
    icon: "❤️",
    actionKey: "pet",
    target: 5,
    reward: { coins: 25, gems: 1, xp: 20 },
  },
];
