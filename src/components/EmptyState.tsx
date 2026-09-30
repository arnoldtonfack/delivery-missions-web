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
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <Icon className="size-6" aria-hidden />
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm">{description}</p>}
      {action}
    </div>
  );
}
