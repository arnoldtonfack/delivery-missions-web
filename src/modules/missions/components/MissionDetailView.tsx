"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { MapPin, PackageCheck, Play, Warehouse } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { QueryStatus } from "@/components/QueryStatus";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { formatDay, formatDateTime } from "@/lib/format";
import { useMission } from "../hooks";
import { MissionsService } from "../module";
import { missionErrorMessage } from "../errors";
import { DRIVER_ACTIONS, MISSION_STATUS_LABEL } from "../status";
import { MissionStatusBadge } from "./MissionStatusBadge";
import { MissionForm } from "./MissionForm";

export function MissionDetailView({
  id,
  driver = false,
}: {
  readonly id: string;
  readonly driver?: boolean;
}): ReactNode {
  const query = useMission(id);
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState(false);
  const [outcome, setOutcome] = useState<"deliver" | "fail">("deliver");
  const [note, setNote] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const mission = query.data;
  async function start(): Promise<void> {
    if (pending) return;
    setPending(true);
    setActionError(null);
    try {
      await MissionsService.start(id);
      toast.success("Mission démarrée. Bonne route !");
      query.reload();
    } catch (err: unknown) {
      const message = missionErrorMessage(err);
      setActionError(message);
      toast.error(message);
      query.reload();
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="space-y-5">
      <Link
        href={driver ? "/driver" : "/dispatch"}
        className="inline-flex min-h-12 items-center text-primary"
      >
        ← {driver ? "Ma tournée" : "Missions"}
      </Link>
      {actionError && (
        <p role="alert" className="panel text-destructive">
          {actionError}
        </p>
      )}
      <QueryStatus
        loading={query.loading}
        error={query.error ? missionErrorMessage(query.error) : null}
        onRetry={query.reload}
      >
        {!mission ? (
          <EmptyState title="Mission introuvable" />
        ) : (
          <>
            <PageHeader
              title={mission.customerName}
              description={`${mission.reference} · ${formatDay(mission.plannedDate)}`}
              actions={<MissionStatusBadge status={mission.status} />}
            />
            <section
              aria-label="Trajet"
              className="panel space-y-6 break-words"
            >
              <div className="flex gap-3">
                <Warehouse
                  className="size-6 shrink-0 text-primary"
                  aria-hidden
                />
                <div>
                  <h2 className="text-sm text-muted-foreground">Retrait</h2>
                  <p className="font-medium">{mission.pickupAddress}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="size-6 shrink-0 text-primary" aria-hidden />
                <div>
                  <h2 className="text-sm text-muted-foreground">Livraison</h2>
                  <p className="text-lg font-semibold">
                    {mission.deliveryAddress}
                  </p>
                </div>
              </div>
              {!driver && (
                <p className="border-t pt-4 text-sm">
                  Chauffeur : <strong>{mission.driver.fullName}</strong>
                </p>
              )}
            </section>
            {mission.deliveryComment && (
              <p className="panel break-words">
                Commentaire : {mission.deliveryComment}
              </p>
            )}
            {mission.failureReason && (
              <p className="panel break-words">
                Raison de l’échec : {mission.failureReason}
              </p>
            )}
            {!driver && mission.status === "PLANNED" && (
              <section className="space-y-4">
                <Button variant="outline" onClick={() => setEditing(!editing)}>
                  {editing ? "Fermer la modification" : "Modifier la mission"}
                </Button>
                {editing && (
                  <MissionForm
                    key={mission.updatedAt}
                    mission={mission}
                    onSaved={() => {
                      setEditing(false);
                      query.reload();
                    }}
                  />
                )}
              </section>
            )}
            <section className="panel space-y-4">
              <h2 className="font-semibold">Historique</h2>
              {!mission.statusHistory.length ? (
                <p className="text-sm text-muted-foreground">
                  Aucun événement enregistré.
                </p>
              ) : (
                <ol className="space-y-5 border-l-2 pl-4">
                  {mission.statusHistory.map((entry) => (
                    <li key={entry.id} className="space-y-1 break-words">
                      <p className="font-medium">
                        {entry.fromStatus
                          ? `${MISSION_STATUS_LABEL[entry.fromStatus]} → `
                          : "Création · "}
                        {MISSION_STATUS_LABEL[entry.toStatus]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(entry.createdAt)} ·{" "}
                        {entry.actor.fullName}
                      </p>
                      {entry.note && <p className="text-sm">{entry.note}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </section>
            {driver && DRIVER_ACTIONS[mission.status].includes("start") && (
              <div className="sticky bottom-0 rounded-xl border bg-card p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <Button
                  className="min-h-14 w-full text-base"
                  disabled={pending}
                  onClick={start}
                >
                  <Play aria-hidden />
                  {pending ? "Démarrage…" : "Démarrer la mission"}
                </Button>
              </div>
            )}
            {driver && DRIVER_ACTIONS[mission.status].includes("deliver") && (
              <section className="panel space-y-4">
                <h2 className="font-semibold">Terminer la mission</h2>
                <FormField label="Résultat">
                  <select
                    value={outcome}
                    onChange={(e) => {
                      setOutcome(e.target.value as "deliver" | "fail");
                      setNote("");
                    }}
                  >
                    <option value="deliver">Livrée</option>
                    <option value="fail">Échec</option>
                  </select>
                </FormField>
                <FormField
                  label={
                    outcome === "deliver"
                      ? "Commentaire (facultatif)"
                      : "Raison de l’échec (obligatoire)"
                  }
                >
                  <textarea
                    rows={3}
                    maxLength={500}
                    required={outcome === "fail"}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </FormField>
                <p
                  id="outcome-unavailable"
                  className="text-sm text-muted-foreground"
                >
                  La confirmation de livraison et le signalement d’échec ne sont
                  pas encore disponibles.
                </p>
                {/* TODO : ajouter deliver/fail à MissionsService et leurs payloads avant de brancher ces confirmations. Une raison non vide après trim est obligatoire en cas d’échec. */}
                <Button
                  className="min-h-14 w-full"
                  disabled
                  aria-describedby="outcome-unavailable"
                >
                  <PackageCheck aria-hidden />
                  {outcome === "deliver"
                    ? "Confirmer la livraison"
                    : "Signaler l’échec"}
                </Button>
              </section>
            )}
          </>
        )}
      </QueryStatus>
    </div>
  );
}
