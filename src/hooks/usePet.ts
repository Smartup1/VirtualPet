import { useEffect } from "react";
import { usePetStore } from "@store/petStore";
import { PetAction } from "@ptypes/index";

/**
 * Hook central para a tela do pet.
 * - Aplica o decaimento do tempo offline assim que a tela monta
 * - Roda um tick a cada X segundos para decair enquanto o app está aberto
 * - Expõe stats, progresso, carteira e a função de ação
 */
export function usePet(tickIntervalMs = 15000) {
  const stats = usePetStore((s) => s.stats);
  const progress = usePetStore((s) => s.progress);
  const wallet = usePetStore((s) => s.wallet);
  const mood = usePetStore((s) => s.mood);
  const name = usePetStore((s) => s.name);
  const performAction = usePetStore((s) => s.performAction);
  const applyOfflineDecay = usePetStore((s) => s.applyOfflineDecay);

  useEffect(() => {
    applyOfflineDecay();
    const interval = setInterval(() => {
      applyOfflineDecay();
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [tickIntervalMs]);

  function handleAction(action: PetAction) {
    performAction(action);
  }

  return {
    name,
    stats,
    progress,
    wallet,
    mood,
    handleAction,
  };
}
