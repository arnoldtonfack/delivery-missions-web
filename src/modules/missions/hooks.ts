"use client";

import { useApiQuery, type ApiQueryState } from "@/hooks/useApiQuery";
import { toQueryString } from "@/lib/query";

import { MissionsService } from "./module";
import type { Mission, MissionDetail, MissionsQuery } from "./types";

/**
 * Missions d'un jour (aujourd'hui par défaut, côté API), filtrables.
 * Pour un chauffeur, l'API ne renvoie que les siennes.
 */
export function useMissions(query: MissionsQuery = {}): ApiQueryState<Mission[]> {
  const { date, driverId, status } = query;
  return useApiQuery(`missions${toQueryString({ date, driverId, status })}`, (signal) =>
    MissionsService.list({ date, driverId, status }, signal),
  );
}

/** Détail + historique. `null` = rien à charger (id pas encore connu). */
export function useMission(id: string | null): ApiQueryState<MissionDetail> {
  return useApiQuery(id === null ? null : `missions/${id}`, (signal) =>
    // `id` est non nul ici : la clé `null` empêche tout fetch sinon.
    MissionsService.get(id ?? "", signal),
  );
}
