import { create } from "zustand";

/** Invalidation commune aux détails et à toutes les listes filtrées montées. */
export const useMissionRevision = create<number>(() => 0);

export function invalidateMissions(): void {
  useMissionRevision.setState((revision) => revision + 1);
}
