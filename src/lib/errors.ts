import { ApiError } from "./http";

/** Messages communs à tous les écrans (codes transverses de l'API). */
const COMMON_MESSAGES: Record<string, string> = {
  INSUFFICIENT_ROLE: "Action non autorisée pour votre rôle.",
  AUTH_TOKEN_MISSING: "Session expirée. Reconnectez-vous.",
  AUTH_TOKEN_INVALID: "Session expirée. Reconnectez-vous.",
  ACCOUNT_DISABLED: "Ce compte est désactivé.",
};

/**
 * Message affichable pour une erreur d'appel API : code métier du module, puis
 * code transverse, puis cas génériques (réseau, 429, validation), puis `fallback`.
 */
export function apiErrorMessage(
  err: unknown,
  messages: Readonly<Record<string, string>>,
  fallback: string,
): string {
  if (!(err instanceof ApiError)) return fallback;
  if (err.code) {
    const known = messages[err.code] ?? COMMON_MESSAGES[err.code];
    if (known) return known;
  }
  if (err.status === 0) return err.message;
  if (err.status === 429) return "Trop de requêtes. Réessayez dans un instant.";
  return fallback;
}
