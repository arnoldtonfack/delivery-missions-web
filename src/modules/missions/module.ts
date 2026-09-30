import { ApiError, http } from "@/lib/http";
import { toQueryString } from "@/lib/query";

import type {
  CreateMissionPayload,
  DeliverMissionPayload,
  FailMissionPayload,
  Mission,
  MissionDetail,
  MissionsQuery,
  UpdateMissionPayload,
} from "./types";

const missionPath = (id: string): string =>
  `/missions/${encodeURIComponent(id)}`;

import { invalidateMissions } from "./invalidation";

/** Une écriture réussie invalide listes et historiques, quel que soit l'appelant. */
async function mutate(operation: Promise<Mission>): Promise<Mission> {
  try {
    const mission = await operation;
    invalidateMissions();
    return mission;
  } catch (error: unknown) {
    // Un conflit signale aussi que l'état affiché peut être périmé.
    if (error instanceof ApiError && error.status === 409) invalidateMissions();
    throw error;
  }
}

export const MissionsService = {
  /** Dispatcher : toutes les missions filtrées. Chauffeur : uniquement les siennes. */
  list: (query: MissionsQuery = {}, signal?: AbortSignal): Promise<Mission[]> =>
    http.get<Mission[]>(`/missions${toQueryString({ ...query })}`, { signal }),

  get: (id: string, signal?: AbortSignal): Promise<MissionDetail> =>
    http.get<MissionDetail>(missionPath(id), { signal }),

  create: (payload: CreateMissionPayload): Promise<Mission> =>
    mutate(http.post<Mission>("/missions", payload)),

  /** Uniquement si PLANNED (sinon 409 `MISSION_NOT_EDITABLE`). */
  update: (id: string, payload: UpdateMissionPayload): Promise<Mission> =>
    mutate(http.patch<Mission>(missionPath(id), payload)),

  /** Chauffeur assigné : PLANNED → STARTED. */
  start: (id: string): Promise<Mission> =>
    mutate(http.post<Mission>(`${missionPath(id)}/start`)),

  deliver: (
    id: string,
    payload: DeliverMissionPayload = {},
  ): Promise<Mission> =>
    mutate(http.post<Mission>(`${missionPath(id)}/deliver`, payload)),

  fail: (id: string, payload: FailMissionPayload): Promise<Mission> =>
    mutate(http.post<Mission>(`${missionPath(id)}/fail`, payload)),
};
