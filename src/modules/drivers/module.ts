import { http } from "@/lib/http";
import { toQueryString } from "@/lib/query";

import type {
  CreateDriverPayload,
  Driver,
  DriversQuery,
  UpdateDriverPayload,
} from "./types";

const driverPath = (id: string): string => `/drivers/${encodeURIComponent(id)}`;

/** Gestion des chauffeurs — routes réservées au rôle DISPATCHER. */
export const DriversService = {
  list: (query: DriversQuery = {}, signal?: AbortSignal): Promise<Driver[]> =>
    http.get<Driver[]>(`/drivers${toQueryString({ ...query })}`, { signal }),

  get: (id: string, signal?: AbortSignal): Promise<Driver> =>
    http.get<Driver>(driverPath(id), { signal }),

  create: (payload: CreateDriverPayload): Promise<Driver> =>
    http.post<Driver>("/drivers", payload),

  update: (id: string, payload: UpdateDriverPayload): Promise<Driver> =>
    http.patch<Driver>(driverPath(id), payload),

  /** Activer / désactiver (jamais de suppression : l'historique est conservé). */
  setActive: (id: string, isActive: boolean): Promise<Driver> =>
    http.patch<Driver>(`${driverPath(id)}/status`, { isActive }),
};
