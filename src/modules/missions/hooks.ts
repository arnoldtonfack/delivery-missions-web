"use client";

import { useApiQuery, type ApiQueryState } from "@/hooks/useApiQuery";
import { toQueryString } from "@/lib/query";

import { useMissionRevision } from "./invalidation";
import { MissionsService } from "./module";
import type { Mission, MissionDetail, MissionsQuery } from "./types";

/**
 * Missions filtrables, plus récentes d'abord. Sans date, l'API renvoie toutes les
 * dates au dispatcher et la journée au chauffeur.
 * Pour un chauffeur, l'API ne renvoie que les siennes.
 */
export function useMissions(
  query: MissionsQuery = {},
): ApiQueryState<Mission[]> {
  const { date, driverId, status } = query;
  const revision = useMissionRevision();
  return useApiQuery(
    `missions${toQueryString({ date, driverId, status })}@${revision}`,
    (signal) => MissionsService.list({ date, driverId, status }, signal),
  );
}

/** Détail + historique. `null` = rien à charger (id pas encore connu). */
export function useMission(id: string | null): ApiQueryState<MissionDetail> {
  const revision = useMissionRevision();
  return useApiQuery(
    id === null ? null : `missions/${id}@${revision}`,
    (signal) =>
      // `id` est non nul ici : la clé `null` empêche tout fetch sinon.
      MissionsService.get(id ?? "", signal),
  );
}
