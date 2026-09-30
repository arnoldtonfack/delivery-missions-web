import { http } from "@/lib/http";
import { toQueryString } from "@/lib/query";

import type {
  CreateMissionPayload,
  Mission,
  MissionDetail,
  MissionsQuery,
  UpdateMissionPayload,
} from "./types";

const missionPath = (id: string): string => `/missions/${encodeURIComponent(id)}`;

/**
 * Appels de l'API missions.
 *
 * Transitions : seul `start` est exposé par l'API pour l'instant ; `deliver` et
 * `fail` seront ajoutés ici quand leurs routes existeront.
 */
export const MissionsService = {
  /** Dispatcher : toutes les missions filtrées. Chauffeur : uniquement les siennes. */
  list: (query: MissionsQuery = {}, signal?: AbortSignal): Promise<Mission[]> =>
    http.get<Mission[]>(`/missions${toQueryString({ ...query })}`, { signal }),

  get: (id: string, signal?: AbortSignal): Promise<MissionDetail> =>
    http.get<MissionDetail>(missionPath(id), { signal }),

  create: (payload: CreateMissionPayload): Promise<Mission> =>
    http.post<Mission>("/missions", payload),

  /** Uniquement si PLANNED (sinon 409 `MISSION_NOT_EDITABLE`). */
  update: (id: string, payload: UpdateMissionPayload): Promise<Mission> =>
    http.patch<Mission>(missionPath(id), payload),

  /** Chauffeur assigné : PLANNED → STARTED. */
  start: (id: string): Promise<Mission> =>
    http.post<Mission>(`${missionPath(id)}/start`),
};
