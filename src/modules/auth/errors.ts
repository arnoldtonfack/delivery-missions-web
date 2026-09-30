import { apiErrorMessage } from "@/lib/errors";

const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "E-mail ou mot de passe incorrect.",
  ACCOUNT_DISABLED: "Ce compte est désactivé. Contactez votre dispatcher.",
};

/** Message affichable pour un échec de connexion. */
export function loginErrorMessage(err: unknown): string {
  return apiErrorMessage(err, MESSAGES, "Connexion impossible. Réessayez.");
}
