// src/constants/achievements.ts
import { PetState } from "@ptypes/index";

export interface AchievementReward {
  coins?: number;
  gems?: number;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  // Lê o estado atual da store e retorna o progresso atual (mesma unidade que `target`).
  // Usa contadores "lifetime" (que nunca resetam) para que a conquista, uma vez
  // alcançada, não deixe de estar disponível se o jogador gastar moedas/itens depois.
  getProgress: (state: PetState) => number;
  reward: AchievementReward;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "level_5",
    title: "Em ascensão",
    description: "Alcance o nível 5",
    icon: "⭐",
    target: 5,
    getProgress: (s) => s.progress.level,
    reward: { coins: 50 },
  },
  {
    id: "level_10",
    title: "Veterano",
    description: "Alcance o nível 10",
    icon: "🌟",
    target: 10,
    getProgress: (s) => s.progress.level,
    reward: { coins: 100, gems: 5 },
  },
  {
    id: "collector_3",
    title: "Colecionador",
    description: "Tenha 3 itens no inventário",
    icon: "🎒",
    target: 3,
    getProgress: (s) => s.inventory.length,
    reward: { coins: 40 },
  },
  {
    id: "collector_8",
    title: "Guarda-roupa cheio",
    description: "Tenha 8 itens no inventário",
    icon: "👗",
    target: 8,
    getProgress: (s) => s.inventory.length,
    reward: { gems: 8 },
  },
  {
    id: "affectionate_50",
    title: "Melhor amigo",
    description: "Dê carinho no pet 50 vezes",
    icon: "❤️",
    target: 50,
    getProgress: (s) => s.lifetimeActionCounts.pet,
    reward: { coins: 60 },
  },
  {
    id: "chef_20",
    title: "Sempre com fome",
    description: "Alimente o pet 20 vezes",
    icon: "🍖",
    target: 20,
    getProgress: (s) => s.lifetimeActionCounts.feed,
    reward: { coins: 60 },
  },
  {
    id: "playful_20",
    title: "Hora de brincar",
    description: "Brinque com o pet 20 vezes",
    icon: "🎮",
    target: 20,
    getProgress: (s) => s.lifetimeActionCounts.play,
    reward: { coins: 60 },
  },
  {
    id: "rich_500",
    title: "Poupador",
    description: "Acumule 500 moedas ao longo do tempo",
    icon: "💰",
    target: 500,
    getProgress: (s) => s.lifetimeCoinsEarned,
    reward: { gems: 10 },
  },
];
