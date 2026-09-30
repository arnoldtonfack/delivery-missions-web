import { ApiError } from "@/lib/http";

const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "E-mail ou mot de passe incorrect.",
  ACCOUNT_DISABLED: "Ce compte est désactivé. Contactez votre dispatcher.",
};

/** Message affichable pour un échec de connexion. */
export function loginErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code && MESSAGES[err.code]) return MESSAGES[err.code];
    if (err.status === 429) {
      return "Trop de tentatives. Réessayez dans une minute.";
    }
    if (err.status === 0) return err.message;
  }
  return "Connexion impossible. Réessayez.";
}
