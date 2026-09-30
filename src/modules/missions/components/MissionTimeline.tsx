import type { ReactNode } from "react";
import {
  CalendarClock,
  Truck,
  CircleCheck,
  CircleX,
  Flag,
  Check,
  History,
} from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { MISSION_STATUS_LABEL } from "../status";
import type { MissionDetail, MissionStatus } from "../types";

const STATUS_ICON = {
  PLANNED: CalendarClock,
  STARTED: Truck,
  DELIVERED: CircleCheck,
  FAILED: CircleX,
};

/** Le résultat est une alternative : un échec n'est jamais présenté comme une livraison. */
export function MissionTimeline({
  mission,
}: {
  readonly mission: MissionDetail;
}): ReactNode {
  const terminal =
    mission.status === "DELIVERED" || mission.status === "FAILED";
  const current =
    mission.status === "PLANNED" ? 0 : mission.status === "STARTED" ? 1 : 2;
  const steps: readonly {
    label: string;
    status: MissionStatus | null;
    date: string | null;
  }[] = [
    { label: "Planifiée", status: "PLANNED", date: mission.createdAt },
    { label: "En cours", status: "STARTED", date: mission.startedAt },
    {
      label: terminal ? MISSION_STATUS_LABEL[mission.status] : "Résultat",
      status: terminal ? mission.status : null,
      date: mission.completedAt,
    },
  ];
  return (
    <section aria-label="Progression de la mission" className="panel space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Suivi de la mission</h2>
        <span className="text-xs text-muted-foreground">
          {terminal ? "Parcours terminé" : `Étape ${current + 1} sur 3`}
        </span>
      </div>
      <ol className="grid gap-0 md:grid-cols-3">
        {steps.map((step, index) => {
          const reached = index <= current;
          const active = index === current;
          const Icon = step.status ? STATUS_ICON[step.status] : Flag;
          return (
            <li
              key={index}
              aria-current={active ? "step" : undefined}
              className="relative min-w-0 pb-7 last:pb-0 md:pb-0 md:pr-4 md:last:pr-0"
            >
              {index < 2 && (
                <span
                  aria-hidden
                  className={`absolute top-11 bottom-0 left-[21px] w-0.5 md:top-[21px] md:right-0 md:bottom-auto md:left-11 md:h-0.5 md:w-auto ${index < current ? "bg-primary" : "border-l-2 border-dashed border-border md:border-t-2 md:border-l-0"}`}
                />
              )}
              <div className="relative flex items-start gap-4 md:flex-col md:gap-3">
                <span
                  data-status={reached ? step.status : undefined}
                  className={`relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-2 ${active ? "ring-4 ring-primary/10" : ""} ${reached ? "border-card" : "border-border bg-card text-muted-foreground"}`}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p
                    className={`text-sm font-semibold ${reached ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.label}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    {index < current && (
                      <Check className="size-3" aria-hidden />
                    )}
                    {active
                      ? terminal
                        ? "Résultat final"
                        : "Étape actuelle"
                      : reached
                        ? "Effectuée"
                        : index === 2
                          ? "Livraison ou échec"
                          : "À venir"}
                  </p>
                  {reached && step.date && (
                    <time
                      dateTime={step.date}
                      className="mt-2 block text-xs text-muted-foreground"
                    >
                      {formatDateTime(step.date)}
                    </time>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function MissionHistory({
  mission,
}: {
  readonly mission: MissionDetail;
}): ReactNode {
  return (
    <section aria-label="Historique de la mission" className="panel space-y-6">
      <div className="flex items-center gap-2">
        <History className="size-5 text-primary" aria-hidden />
        <h2 className="font-semibold">Historique</h2>
        <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          {mission.statusHistory.length} événement
          {mission.statusHistory.length > 1 ? "s" : ""}
        </span>
      </div>
      {!mission.statusHistory.length ? (
        <p className="text-sm text-muted-foreground">
          Aucun événement enregistré.
        </p>
      ) : (
        <ol>
          {mission.statusHistory.map((entry, index) => {
            const Icon = STATUS_ICON[entry.toStatus];
            return (
              <li key={entry.id} className="relative flex gap-4 pb-7 last:pb-0">
                {index < mission.statusHistory.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-10 bottom-0 left-[19px] w-px bg-border"
                  />
                )}
                <span
                  data-status={entry.toStatus}
                  className="relative flex size-10 shrink-0 items-center justify-center rounded-full"
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-sm font-semibold">
                      {entry.fromStatus
                        ? `${MISSION_STATUS_LABEL[entry.fromStatus]} → ${MISSION_STATUS_LABEL[entry.toStatus]}`
                        : "Mission créée"}
                    </p>
                    <time
                      dateTime={entry.createdAt}
                      className="text-xs text-muted-foreground"
                    >
                      {formatDateTime(entry.createdAt)}
                    </time>
                  </div>
                  <p className="break-words text-xs text-muted-foreground">
                    Par {entry.actor.fullName}
                  </p>
                  {entry.note && (
                    <p className="rounded-xl border bg-background p-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {entry.note}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
