import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly icon?: LucideIcon;
  readonly action?: ReactNode;
}

/** État vide des listes (aucune mission aujourd'hui, aucun chauffeur…). */
export function EmptyState({
  title = "Aucune donnée",
  description,
  icon: Icon = Inbox,
  action,
}: EmptyStateProps): ReactNode {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="mb-2 flex size-16 items-center justify-center rounded-2xl bg-muted text-primary">
        <Icon className="size-7" aria-hidden />
      </span>
      <p className="text-lg font-semibold">{title}</p>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
