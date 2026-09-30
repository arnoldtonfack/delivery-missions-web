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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && <p className="text-sm">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
