import { AppEnv } from "@/config/env";
import { useAuthStore } from "@/modules/auth/store";

/**
 * Client HTTP minimal (fetch) pour l'API Delivery Missions.
 *
 * - Préfixe chaque chemin avec `AppEnv.apiUrl` + `AppEnv.apiPrefix` : les modules
 *   ne passent que le chemin relatif (`/missions`).
 * - Déballe l'enveloppe de succès `{ success, data, timestamp }`.
 * - Convertit les erreurs `{ statusCode, message, error }` en `ApiError` portant le
 *   code métier (`INVALID_CREDENTIALS`, `INVALID_STATUS_TRANSITION`…).
 * - Sur un `401` d'une requête authentifiée, la session est expirée ou révoquée
 *   (compte désactivé) : on vide la session, le garde renvoie vers /login.
 */

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Erreur normalisée. `status === 0` = aucune réponse reçue (réseau, délai).
 * `code` est le code métier renvoyé par l'API, ou `null` pour une erreur de
 * validation (le détail est alors dans `details`).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  /** Messages de validation (`ValidationPipe`) quand l'API en renvoie plusieurs. */
  readonly details: readonly string[];

  constructor(
    status: number,
    code: string | null,
    message: string,
    options?: { cause?: unknown; details?: readonly string[] },
  ) {
    super(message, options);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = options?.details ?? [];
  }
}

type Method = "GET" | "POST" | "PATCH" | "DELETE";

export interface RequestOptions {
  body?: unknown;
  /** `false` pour les routes publiques (login). */
  auth?: boolean;
  signal?: AbortSignal;
}

function buildUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${AppEnv.apiUrl.replace(/\/+$/, "")}${AppEnv.apiPrefix}${cleanPath}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Code métier = message en MAJUSCULES_SNAKE ; sinon c'est un texte libre. */
const BUSINESS_CODE = /^[A-Z][A-Z0-9_]*$/;

function toApiError(status: number, body: unknown): ApiError {
  const raw = isRecord(body) ? body.message : undefined;
  if (Array.isArray(raw)) {
    const details = raw.filter((m): m is string => typeof m === "string");
    return new ApiError(status, null, details[0] ?? "Requête invalide.", {
      details,
    });
  }
  if (typeof raw === "string") {
    return new ApiError(status, BUSINESS_CODE.test(raw) ? raw : null, raw);
  }
  return new ApiError(status, null, `Erreur ${status}`);
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function request<T>(
  method: Method,
  path: string,
  { body, auth = true, signal }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = auth ? useAuthStore.getState().accessToken : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (err: unknown) {
    const timedOut = err instanceof DOMException && err.name === "TimeoutError";
    throw new ApiError(
      0,
      timedOut ? "TIMEOUT" : "NETWORK",
      timedOut
        ? "Le serveur met trop de temps à répondre."
        : "Impossible de joindre le serveur.",
      { cause: err },
    );
  }

  const payload = await readJson(response);

  if (!response.ok) {
    if (response.status === 401 && token) {
      useAuthStore.getState().logout();
    }
    throw toApiError(response.status, payload);
  }

  // L'enveloppe est ajoutée par le `ResponseInterceptor` de l'API.
  // Le typage de `data` repose sur le contrat de la route appelée.
  return (isRecord(payload) && "data" in payload ? payload.data : payload) as T;
}

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, "body">) =>
    request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, options),
};
