import { http } from "@/lib/http";
import { toQueryString } from "@/lib/query";

import type {
  CreateDriverPayload,
  Driver,
  DriversQuery,
  UpdateDriverPayload,
} from "./types";

/** Gestion des chauffeurs — routes réservées au rôle DISPATCHER. */
export const DriversService = {
  list: (query: DriversQuery = {}): Promise<Driver[]> =>
    http.get<Driver[]>(`/drivers${toQueryString({ ...query })}`),

  get: (id: string): Promise<Driver> =>
    http.get<Driver>(`/drivers/${encodeURIComponent(id)}`),

  create: (payload: CreateDriverPayload): Promise<Driver> =>
    http.post<Driver>("/drivers", payload),

  update: (id: string, payload: UpdateDriverPayload): Promise<Driver> =>
    http.patch<Driver>(`/drivers/${encodeURIComponent(id)}`, payload),

  /** Activer / désactiver (jamais de suppression : l'historique est conservé). */
  setActive: (id: string, isActive: boolean): Promise<Driver> =>
    http.patch<Driver>(`/drivers/${encodeURIComponent(id)}/status`, {
      isActive,
    }),
};
