// src/constants/gameplay.ts
import { PetAction, PetStats } from "@ptypes/index";

export const STAT_MAX = 100;
export const STAT_MIN = 0;

export const DECAY_PER_MINUTE: Record<keyof PetStats, number> = {
  hunger: 0.8,
  happiness: 0.5,
  sleep: 0.6,
  hygiene: 0.4,
};

export const ACTION_GAIN: Record<PetAction, Partial<PetStats>> = {
  feed: { hunger: 30, happiness: 5 },
  play: { happiness: 30, hunger: -5, sleep: -10 },
  sleep: { sleep: 40, happiness: 5 },
  bathe: { hygiene: 30, happiness: 5 },
  pet: { happiness: 10 },
};

export const XP_PER_ACTION: Record<PetAction, number> = {
  feed: 10,
  play: 15,
  sleep: 8,
  bathe: 5,
  pet: 2,
};

export function xpNeededForLevel(level: number): number {
  return Math.floor(50 + (level - 1) * 25 + (level - 1) ** 1.5 * 2);
}