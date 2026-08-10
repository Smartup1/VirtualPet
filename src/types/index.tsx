// src/types/index.ts
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
  inventory: string[]; // ids de ShopItem já comprados
  equippedAccessory: string | null; // id de um item da categoria "accessory"
  // NOVOS campos para interação
  interactionCount: number;
  lastInteractionAt: number;
}

export type PetAction = "feed" | "play" | "sleep" | "bathe" | "pet";

export type ShopCurrency = "coins" | "gems";

export type ShopCategory = "accessory" | "food" | "boost";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji por enquanto — trocar por asset quando tiver arte final
  price: number;
  currency: ShopCurrency;
  category: ShopCategory;
  // Para itens de categoria "food"/"boost": ganho imediato ao comprar (opcional)
  statBoost?: Partial<PetStats>;
}