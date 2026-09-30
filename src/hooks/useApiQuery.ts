"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";

export interface ApiQueryState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  /** L'erreur brute : chaque module la traduit avec son `errors.ts`. */
  readonly error: unknown;
  /** Relance la requête (après une action, ou bouton « Réessayer »). */
  readonly reload: () => void;
}

interface QueryResult<T> {
  readonly key: string;
  readonly nonce: number;
  readonly data: T | null;
  readonly error: unknown;
}

/**
 * Lecture API côté client : chargement, erreur, rechargement, et abandon de la
 * requête précédente quand `key` change ou que le composant est démonté (une
 * réponse lente ne peut pas écraser une plus récente).
 *
 * `key` identifie la requête (ex. `missions?date=…&status=…`) : le fetch est
 * relancé quand elle change. `null` = ne rien charger (paramètre pas encore prêt).
 * `fetcher` n'a pas besoin d'être mémoïsé : seule `key` relance le fetch.
 */
export function useApiQuery<T>(
  key: string | null,
  fetcher: (signal: AbortSignal) => Promise<T>,
): ApiQueryState<T> {
  const [nonce, setNonce] = useState(0);
  const [result, setResult] = useState<QueryResult<T> | null>(null);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const run = useEffectEvent((signal: AbortSignal) => fetcher(signal));

  useEffect(() => {
    if (key === null) return;
    const controller = new AbortController();
    run(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) {
          setResult({ key, nonce, data, error: null });
        }
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setResult((prev) => ({ key, nonce, data: prev?.data ?? null, error }));
        }
      },
    );
    return () => controller.abort();
  }, [key, nonce]);

  // Chargement = pas encore de résultat pour la requête courante. Les données
  // précédentes restent affichées pendant un rechargement (pas de clignotement).
  const loading =
    key !== null && (result?.key !== key || result.nonce !== nonce);

  return {
    data: result?.data ?? null,
    loading,
    error: loading ? null : (result?.error ?? null),
    reload,
  };
}
