import type { Role } from "./types";

/**
 * Cookie lu par `src/proxy.ts` pour aiguiller la navigation selon le rôle.
 *
 * Il ne transporte AUCUN jeton, seulement le rôle : ce n'est pas une barrière de
 * sécurité. L'API vérifie le JWT et le rôle à chaque appel ; ce cookie évite
 * juste d'afficher un écran que l'utilisateur ne pourra pas utiliser.
 */
export const SESSION_COOKIE = "dm_session";

export const ROLES: readonly Role[] = ["DISPATCHER", "DRIVER"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Écran d'accueil de chaque rôle. */
export function homePathFor(role: Role): string {
  return role === "DISPATCHER" ? "/dispatch" : "/driver";
}

/** Aligne le cookie de navigation sur la session (`null` = déconnecté). */
export function syncSessionCookie(role: Role | null, maxAgeSeconds = 0): void {
  if (typeof document === "undefined") return;
  // `Secure` seulement en HTTPS : en http://localhost le navigateur ignorerait l'écriture.
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = role
    ? `${SESSION_COOKIE}=${role}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`
    : `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
