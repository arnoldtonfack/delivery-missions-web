import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface QueryStatusProps {
  readonly loading: boolean;
  /** Message déjà traduit (via le `errors.ts` du module), ou `null`. */
  readonly error: string | null;
  readonly onRetry: () => void;
  readonly children: ReactNode;
}

/**
 * Enveloppe d'une zone chargée par `useApiQuery` : chargement, erreur avec
 * « Réessayer », sinon le contenu. Évite de réécrire ces trois états par écran.
 */
export function QueryStatus({
  loading,
  error,
  onRetry,
  children,
}: QueryStatusProps): ReactNode {
  if (error) {
    return (
      <div role="alert" className="flex flex-col items-start gap-2">
        <p>{error}</p>
        <Button variant="outline" onClick={onRetry}>
          Réessayer
        </Button>
      </div>
    );
  }
  if (loading) return <p aria-busy="true">Chargement…</p>;
  return children;
}
