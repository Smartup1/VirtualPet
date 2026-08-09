import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PetState, PetAction, PetStats } from "@ptypes/index";
import {
  ACTION_GAIN,
  DECAY_PER_MINUTE,
  STAT_MAX,
  STAT_MIN,
  XP_PER_ACTION,
  xpNeededForLevel,
} from "@constants/gameplay";
import { SHOP_ITEMS } from "@constants/shopItems";

interface PetStore extends PetState {
  performAction: (action: PetAction) => void;
  applyOfflineDecay: () => void;
  addCurrency: (coins: number, gems: number) => void;
  spendCoins: (amount: number) => boolean;
  spendGems: (amount: number) => boolean;
  /** Retorna "ok", "already_owned", "not_enough_funds" ou "not_found" */
  purchaseItem: (itemId: string) => "ok" | "already_owned" | "not_enough_funds" | "not_found";
  equipAccessory: (itemId: string | null) => void;
}

const initialState: PetState = {
  name: "Capy",
  stats: {
    hunger: 80,
    happiness: 80,
    sleep: 80,
    hygiene: 80,
  },
  progress: {
    level: 1,
    xp: 0,
    xpToNextLevel: xpNeededForLevel(1),
  },
  wallet: {
    coins: 100,
    gems: 5,
  },
  mood: "happy",
  lastUpdatedAt: Date.now(),
  inventory: [],
  equippedAccessory: null,
};

function clampStat(value: number) {
  return Math.max(STAT_MIN, Math.min(STAT_MAX, value));
}

function computeMood(stats: PetState["stats"]): PetState["mood"] {
  const avg = (stats.hunger + stats.happiness + stats.sleep + stats.hygiene) / 4;
  if (avg < 30) return "sad";
  if (avg < 60) return "neutral";
  return "happy";
}

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      performAction: (action) => {
        const gain = ACTION_GAIN[action] ?? {};
        const xpGain = XP_PER_ACTION[action] ?? 0;

        set((state) => {
          const newStats = { ...state.stats };
          (Object.keys(gain) as (keyof typeof gain)[]).forEach((key) => {
            newStats[key] = clampStat(newStats[key] + (gain[key] ?? 0));
          });

          let { level, xp, xpToNextLevel } = state.progress;
          xp += xpGain;
          while (xp >= xpToNextLevel) {
            xp -= xpToNextLevel;
            level += 1;
            xpToNextLevel = xpNeededForLevel(level);
          }

          return {
            stats: newStats,
            progress: { level, xp, xpToNextLevel },
            mood: action === "sleep" ? "sleeping" : action === "feed" ? "eating" : computeMood(newStats),
            lastUpdatedAt: Date.now(),
          };
        });
      },

      applyOfflineDecay: () => {
        const state = get();
        const minutesPassed = (Date.now() - state.lastUpdatedAt) / 60000;
        if (minutesPassed <= 0) return;

        const newStats = { ...state.stats };
        (Object.keys(DECAY_PER_MINUTE) as (keyof typeof DECAY_PER_MINUTE)[]).forEach((key) => {
          newStats[key] = clampStat(newStats[key] - DECAY_PER_MINUTE[key] * minutesPassed);
        });

        set({
          stats: newStats,
          mood: computeMood(newStats),
          lastUpdatedAt: Date.now(),
        });
      },

      addCurrency: (coins, gems) => {
        set((state) => ({
          wallet: {
            coins: state.wallet.coins + coins,
            gems: state.wallet.gems + gems,
          },
        }));
      },

      spendCoins: (amount) => {
        const { wallet } = get();
        if (wallet.coins < amount) return false;
        set({ wallet: { ...wallet, coins: wallet.coins - amount } });
        return true;
      },

      spendGems: (amount) => {
        const { wallet } = get();
        if (wallet.gems < amount) return false;
        set({ wallet: { ...wallet, gems: wallet.gems - amount } });
        return true;
      },

      purchaseItem: (itemId) => {
        const item = SHOP_ITEMS.find((i) => i.id === itemId);
        if (!item) return "not_found";

        const state = get();

        // Acessórios são comprados uma única vez; comida/boost são consumíveis
        // e podem ser comprados repetidamente.
        if (item.category === "accessory" && state.inventory.includes(itemId)) {
          return "already_owned";
        }

        const paid =
          item.currency === "coins" ? get().spendCoins(item.price) : get().spendGems(item.price);
        if (!paid) return "not_enough_funds";

        set((current) => {
          const inventory = current.inventory.includes(itemId)
            ? current.inventory
            : [...current.inventory, itemId];

          let newStats = current.stats;
          if (item.statBoost) {
            newStats = { ...current.stats };
            (Object.keys(item.statBoost) as (keyof PetStats)[]).forEach((key) => {
              const gain = item.statBoost?.[key] ?? 0;
              newStats[key] = clampStat(newStats[key] + gain);
            });
          }

          return {
            inventory,
            stats: newStats,
            mood: item.statBoost ? computeMood(newStats) : current.mood,
          };
        });

        return "ok";
      },

      equipAccessory: (itemId) => {
        const state = get();
        if (itemId !== null && !state.inventory.includes(itemId)) return;
        set({ equippedAccessory: itemId });
      },
    }),
    {
      name: "capypet-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
