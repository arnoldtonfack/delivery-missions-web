import type { ReactNode } from "react";

interface PageHeaderProps {
  readonly title: ReactNode;
  readonly description?: string;
  /** Boutons à droite du titre (ex. « Nouvelle mission »). */
  readonly actions?: ReactNode;
}

/** En-tête de page : titre, sous-titre et actions. */
export function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps): ReactNode {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-2">
        <h1 className="break-words text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
