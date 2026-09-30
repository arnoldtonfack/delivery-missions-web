import { apiErrorMessage } from "@/lib/errors";

const MESSAGES: Record<string, string> = {
  DRIVER_NOT_FOUND: "Chauffeur introuvable.",
  EMAIL_ALREADY_USED: "Cet e-mail est déjà utilisé.",
  DRIVER_HAS_OPEN_MISSIONS:
    "Ce chauffeur a encore des missions planifiées ou en cours : réassignez-les d'abord.",
};

export function driverErrorMessage(
  err: unknown,
  fallback = "Une erreur est survenue. Réessayez.",
): string {
  return apiErrorMessage(err, MESSAGES, fallback);
}
