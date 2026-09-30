import { apiErrorMessage } from "@/lib/errors";

const MESSAGES: Record<string, string> = {
  MISSION_NOT_FOUND: "Mission introuvable.",
  INVALID_STATUS_TRANSITION:
    "Cette action n'est plus possible : le statut de la mission a changé.",
  MISSION_CONFLICT:
    "La mission vient d'être modifiée ailleurs. Rechargez puis réessayez.",
  MISSION_NOT_EDITABLE:
    "Seule une mission planifiée (non démarrée) peut être modifiée.",
  MISSION_REFERENCE_ALREADY_USED: "Cette référence est déjà utilisée.",
  PLANNED_DATE_IN_PAST: "La date prévue doit être aujourd'hui ou plus tard.",
  DRIVER_NOT_FOUND: "Chauffeur introuvable.",
  DRIVER_INACTIVE: "Ce chauffeur est désactivé.",
};

export function missionErrorMessage(
  err: unknown,
  fallback = "Une erreur est survenue. Réessayez.",
): string {
  return apiErrorMessage(err, MESSAGES, fallback);
}
