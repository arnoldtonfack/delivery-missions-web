"use client";

import { useApiQuery, type ApiQueryState } from "@/hooks/useApiQuery";
import { toQueryString } from "@/lib/query";

import { DriversService } from "./module";
import type { Driver, DriversQuery } from "./types";

/**
 * Chauffeurs (dispatcher). `{ isActive: true }` pour les listes d'assignation :
 * l'API refuse d'assigner un chauffeur désactivé.
 */
export function useDrivers(query: DriversQuery = {}): ApiQueryState<Driver[]> {
  const { isActive } = query;
  return useApiQuery(`drivers${toQueryString({ isActive })}`, (signal) =>
    DriversService.list({ isActive }, signal),
  );
}
