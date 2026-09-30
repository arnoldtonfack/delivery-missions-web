import type { ReactNode } from "react";
import {
  CalendarClock,
  Truck,
  CircleCheck,
  CircleX,
  ArrowUpRight,
} from "lucide-react";
import type { Mission } from "../types";

export function MissionOverview({
  missions,
  driver = false,
}: {
  readonly missions: readonly Mission[];
  readonly driver?: boolean;
}): ReactNode {
  const completed = missions.filter(
    (m) => m.status === "DELIVERED" || m.status === "FAILED",
  ).length;
  if (driver)
    return (
      <section
        aria-label="Progression de la tournée"
        className="brand-surface relative overflow-hidden rounded-3xl p-6"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest">
              Votre progression
            </p>
            <ArrowUpRight className="size-5" aria-hidden />
          </div>
          <p className="mt-5 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight">
              {completed}
            </span>
            <span className="text-sm">
              / {missions.length} missions terminées
            </span>
          </p>
          <progress
            className="tour-progress mt-5 h-1.5 w-full"
            aria-label="Missions terminées"
            value={completed}
            max={missions.length || 1}
          />
          <p className="mt-3 text-sm">
            {missions.length === 0
              ? "Votre tournée se prépare."
              : completed === missions.length
                ? "Votre tournée est terminée."
                : `${missions.length - completed} mission${missions.length - completed > 1 ? "s" : ""} restante${missions.length - completed > 1 ? "s" : ""}. À votre rythme, étape par étape.`}
          </p>
        </div>
      </section>
    );
  return (
    <section
      aria-label="Statuts dans la sélection actuelle"
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Dans la sélection
        </p>
        <p className="text-sm text-muted-foreground">
          {missions.length} mission{missions.length > 1 ? "s" : ""}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { status: "PLANNED", label: "Planifiées", icon: CalendarClock },
          { status: "STARTED", label: "En cours", icon: Truck },
          { status: "DELIVERED", label: "Livrées", icon: CircleCheck },
          { status: "FAILED", label: "Échouées", icon: CircleX },
        ].map(({ status, label, icon: Icon }) => (
          <div
            key={status}
            className="panel flex items-center justify-between gap-2"
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
                {missions.filter((m) => m.status === status).length}
              </p>
            </div>
            <span
              data-status={status}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            >
              <Icon className="size-5" aria-hidden />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
