// Valores de balanceamento — ajuste livremente durante os testes

export const STAT_MAX = 100;
export const STAT_MIN = 0;

// Quanto cada stat decai por minuto real
export const DECAY_PER_MINUTE = {
  hunger: 1.2,
  happiness: 0.8,
  sleep: 0.5,
  hygiene: 0.6,
};

// Ganho ao usar cada ação
export const ACTION_GAIN: Record<string, Partial<Record<keyof typeof DECAY_PER_MINUTE, number>>> = {
  feed: { hunger: 30 },
  play: { happiness: 25 },
  sleep: { sleep: 40 },
  bathe: { hygiene: 35 },
  pet: { happiness: 10 },
};

export const XP_PER_ACTION: Record<string, number> = {
  feed: 5,
  play: 8,
  sleep: 4,
  bathe: 5,
  pet: 2,
};

export function xpNeededForLevel(level: number): number {
  return 50 + level * 25;
}

// Abaixo desse valor de stat, dispara alerta/notificação
export const LOW_STAT_THRESHOLD = 20;
