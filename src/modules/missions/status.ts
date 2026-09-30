import type { MissionStatus } from "./types";

export const MISSION_STATUSES: readonly MissionStatus[] = [
  "PLANNED",
  "STARTED",
  "DELIVERED",
  "FAILED",
];

export const MISSION_STATUS_LABEL: Readonly<Record<MissionStatus, string>> = {
  PLANNED: "Planifiée",
  STARTED: "En cours",
  DELIVERED: "Livrée",
  FAILED: "Échouée",
};

/** Action du chauffeur sur une mission. */
export type DriverAction = "start" | "deliver" | "fail";

export const DRIVER_ACTION_LABEL: Readonly<Record<DriverAction, string>> = {
  start: "Démarrer",
  deliver: "Livrée",
  fail: "Échec",
};

/**
 * Actions proposées au chauffeur selon le statut — COPIE D'AFFICHAGE de la
 * machine à états de l'API (`PLANNED → STARTED → DELIVERED | FAILED`). Elle sert
 * seulement à ne montrer que les boutons utiles : c'est l'API qui décide, et un
 * refus (409 `INVALID_STATUS_TRANSITION`) reste possible.
 */
export const DRIVER_ACTIONS: Readonly<
  Record<MissionStatus, readonly DriverAction[]>
> = {
  PLANNED: ["start"],
  STARTED: ["deliver", "fail"],
  DELIVERED: [],
  FAILED: [],
};

export const isTerminal = (status: MissionStatus): boolean =>
  DRIVER_ACTIONS[status].length === 0;
