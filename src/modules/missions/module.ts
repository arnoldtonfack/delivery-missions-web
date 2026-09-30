import { http } from "@/lib/http";
import { toQueryString } from "@/lib/query";

import type {
  CreateMissionPayload,
  Mission,
  MissionDetail,
  MissionsQuery,
  UpdateMissionPayload,
} from "./types";

/**
 * Appels de l'API missions.
 *
 * Le changement de statut (PLANNED → STARTED → DELIVERED | FAILED) sera ajouté
 * ici quand la route sera exposée par l'API.
 */
export const MissionsService = {
  /** Dispatcher : toutes les missions filtrées. Chauffeur : uniquement les siennes. */
  list: (query: MissionsQuery = {}): Promise<Mission[]> =>
    http.get<Mission[]>(`/missions${toQueryString({ ...query })}`),

  get: (id: string): Promise<MissionDetail> =>
    http.get<MissionDetail>(`/missions/${encodeURIComponent(id)}`),

  create: (payload: CreateMissionPayload): Promise<Mission> =>
    http.post<Mission>("/missions", payload),

  update: (id: string, payload: UpdateMissionPayload): Promise<Mission> =>
    http.patch<Mission>(`/missions/${encodeURIComponent(id)}`, payload),
};
