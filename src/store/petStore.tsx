// src/store/petStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PetState, PetAction, PetStats, PetMood, MissionActionKey } from "@ptypes/index";
import {
  ACTION_GAIN,
  DECAY_PER_MINUTE,
  STAT_MAX,
  STAT_MIN,
  XP_PER_ACTION,
  xpNeededForLevel,
} from "@constants/gameplay";
import { SHOP_ITEMS } from "@constants/shopItems";
import { DAILY_MISSIONS } from "@constants/missions";
import { ACHIEVEMENTS } from "@constants/achievements";

// Chave do dia local (YYYY-MM-DD), usada para saber quando as missões diárias
// devem reiniciar.
function todayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function emptyActionCounts(): Record<MissionActionKey, number> {
  return { feed: 0, play: 0, sleep: 0, bathe: 0, pet: 0 };
}

export type ClaimResult = "ok" | "not_ready" | "already_claimed" | "not_found";

// Interface estendida da store
interface PetStore extends PetState {
  // Ações existentes
  performAction: (action: PetAction) => void;
  applyOfflineDecay: () => void;
  addCurrency: (coins: number, gems: number) => void;
  spendCoins: (amount: number) => boolean;
  spendGems: (amount: number) => boolean;
  purchaseItem: (itemId: string) => "ok" | "already_owned" | "not_enough_funds" | "not_found";
  equipAccessory: (itemId: string | null) => void;
  
  // NOVAS ações para interação com o pet
  petInteraction: () => void;
  setMood: (mood: PetMood) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  addXP: (amount: number) => void;
  resetPet: () => void;
  feed: () => void;
  play: () => void;
  sleepAction: () => void;
  bathe: () => void;

  // Missões diárias e conquistas
  refreshDailyMissions: () => void;
  claimMission: (missionId: string) => ClaimResult;
  claimAchievement: (achievementId: string) => ClaimResult;
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
  interactionCount: 0,
  lastInteractionAt: Date.now(),
  dailyMissions: {
    date: todayKey(),
    actionCounts: emptyActionCounts(),
    claimed: [],
  },
  claimedAchievements: [],
  lifetimeActionCounts: emptyActionCounts(),
  lifetimeCoinsEarned: 0,
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

      // =============================================
      // AÇÕES EXISTENTES
      // =============================================

      performAction: (action) => {
        // Garante que os contadores diários estão no dia certo antes de somar.
        get().refreshDailyMissions();

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
            dailyMissions: {
              ...state.dailyMissions,
              actionCounts: {
                ...state.dailyMissions.actionCounts,
                [action]: state.dailyMissions.actionCounts[action] + 1,
              },
            },
            lifetimeActionCounts: {
              ...state.lifetimeActionCounts,
              [action]: state.lifetimeActionCounts[action] + 1,
            },
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
          lifetimeCoinsEarned: state.lifetimeCoinsEarned + Math.max(0, coins),
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

      // =============================================
      // NOVAS AÇÕES PARA INTERAÇÃO
      // =============================================

      petInteraction: () => {
        get().refreshDailyMissions();

        const state = get();
        const now = Date.now();
        const timeSinceLastInteraction = (now - state.lastInteractionAt) / 1000;

        let happinessGain = 5;
        let coinGain = 1;

        if (timeSinceLastInteraction > 60) {
          happinessGain = 10;
          coinGain = 2;
        }

        const interactionBonus = Math.floor(state.interactionCount / 10) + 1;
        happinessGain += interactionBonus;

        const newStats = { ...state.stats };
        newStats.happiness = clampStat(newStats.happiness + happinessGain);

        set({
          stats: newStats,
          mood: computeMood(newStats),
          wallet: {
            ...state.wallet,
            coins: state.wallet.coins + coinGain,
          },
          interactionCount: state.interactionCount + 1,
          lastInteractionAt: now,
          lifetimeCoinsEarned: state.lifetimeCoinsEarned + coinGain,
          dailyMissions: {
            ...state.dailyMissions,
            actionCounts: {
              ...state.dailyMissions.actionCounts,
              pet: state.dailyMissions.actionCounts.pet + 1,
            },
          },
          lifetimeActionCounts: {
            ...state.lifetimeActionCounts,
            pet: state.lifetimeActionCounts.pet + 1,
          },
        });
      },

      setMood: (mood: PetMood) => {
        set({ mood });
      },

      addCoins: (amount) => {
        set((state) => ({
          wallet: {
            ...state.wallet,
            coins: state.wallet.coins + amount,
          },
          lifetimeCoinsEarned: state.lifetimeCoinsEarned + Math.max(0, amount),
        }));
      },

      addGems: (amount) => {
        set((state) => ({
          wallet: {
            ...state.wallet,
            gems: state.wallet.gems + amount,
          },
        }));
      },

      addXP: (amount) => {
        set((state) => {
          let { level, xp, xpToNextLevel } = state.progress;
          xp += amount;
          
          let leveledUp = false;
          while (xp >= xpToNextLevel) {
            xp -= xpToNextLevel;
            level += 1;
            xpToNextLevel = xpNeededForLevel(level);
            leveledUp = true;
          }

          return {
            progress: { level, xp, xpToNextLevel },
            ...(leveledUp && {
              stats: {
                ...state.stats,
                happiness: clampStat(state.stats.happiness + 10),
              },
              mood: "happy",
            }),
          };
        });
      },

      resetPet: () => {
        set({
          ...initialState,
          lastUpdatedAt: Date.now(),
          lastInteractionAt: Date.now(),
          dailyMissions: {
            date: todayKey(),
            actionCounts: emptyActionCounts(),
            claimed: [],
          },
        });
      },

      // Ações rápidas
      feed: () => {
        get().performAction("feed");
      },

      play: () => {
        get().performAction("play");
      },

      sleepAction: () => {
        get().performAction("sleep");
      },

      bathe: () => {
        get().performAction("bathe");
      },

      // =============================================
      // MISSÕES DIÁRIAS E CONQUISTAS
      // =============================================

      // Se o dia local mudou desde a última vez, zera o progresso diário.
      // Chamado sempre que uma ação acontece e também ao abrir as telas de
      // missões, para garantir que o reset acontece mesmo sem interação.
      refreshDailyMissions: () => {
        const state = get();
        const today = todayKey();
        if (state.dailyMissions.date === today) return;

        set({
          dailyMissions: {
            date: today,
            actionCounts: emptyActionCounts(),
            claimed: [],
          },
        });
      },

      claimMission: (missionId) => {
        get().refreshDailyMissions();

        const mission = DAILY_MISSIONS.find((m) => m.id === missionId);
        if (!mission) return "not_found";

        const state = get();
        if (state.dailyMissions.claimed.includes(missionId)) return "already_claimed";

        const progress = state.dailyMissions.actionCounts[mission.actionKey] ?? 0;
        if (progress < mission.target) return "not_ready";

        const { coins = 0, gems = 0, xp = 0 } = mission.reward;

        set((current) => ({
          wallet: {
            coins: current.wallet.coins + coins,
            gems: current.wallet.gems + gems,
          },
          lifetimeCoinsEarned: current.lifetimeCoinsEarned + coins,
          dailyMissions: {
            ...current.dailyMissions,
            claimed: [...current.dailyMissions.claimed, missionId],
          },
        }));

        if (xp > 0) get().addXP(xp);

        return "ok";
      },

      claimAchievement: (achievementId) => {
        const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
        if (!achievement) return "not_found";

        const state = get();
        if (state.claimedAchievements.includes(achievementId)) return "already_claimed";

        const progress = achievement.getProgress(state);
        if (progress < achievement.target) return "not_ready";

        const { coins = 0, gems = 0 } = achievement.reward;

        set((current) => ({
          wallet: {
            coins: current.wallet.coins + coins,
            gems: current.wallet.gems + gems,
          },
          lifetimeCoinsEarned: current.lifetimeCoinsEarned + coins,
          claimedAchievements: [...current.claimedAchievements, achievementId],
        }));

        return "ok";
      },
    }),
    {
      name: "capypet-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // v3: adiciona dailyMissions, claimedAchievements e contadores lifetime.
      // Saves antigos continuam funcionando: os campos novos simplesmente
      // partem dos valores padrão definidos em `initialState`.
      version: 3,
    }
  )
);
