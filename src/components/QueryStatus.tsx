import { CircleAlert, LoaderCircle } from "lucide-react";
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
      <div role="alert" className="panel flex flex-col items-start gap-4">
        <CircleAlert className="size-6 text-destructive" aria-hidden />
        <p>{error}</p>
        <Button variant="outline" onClick={onRetry}>
          Réessayer
        </Button>
      </div>
    );
  }
  if (loading)
    return (
      <div
        role="status"
        aria-busy="true"
        className="flex items-center gap-3 rounded-xl bg-muted p-5 text-sm text-muted-foreground"
      >
        <LoaderCircle className="size-5 animate-spin" aria-hidden />
        Chargement…
      </div>
    );
  return children;
}
