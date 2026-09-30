"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { MapPin, PackageCheck, Play, Warehouse } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { QueryStatus } from "@/components/QueryStatus";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { formatDay } from "@/lib/format";
import { useMission } from "../hooks";
import { MissionsService } from "../module";
import { missionErrorMessage } from "../errors";
import { DRIVER_ACTIONS } from "../status";
import { MissionStatusBadge } from "./MissionStatusBadge";
import { MissionTimeline, MissionHistory } from "./MissionTimeline";
import { MissionForm } from "./MissionForm";

export function MissionDetailView({
  id,
  driver = false,
}: {
  readonly id: string;
  readonly driver?: boolean;
}): ReactNode {
  const query = useMission(id);
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState(false);
  const [outcome, setOutcome] = useState<"deliver" | "fail">("deliver");
  const [note, setNote] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const mission = query.data;
  async function start(): Promise<void> {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setActionError(null);
    try {
      await MissionsService.start(id);
      toast.success("Mission démarrée. Bonne route !");
    } catch (err: unknown) {
      const message = missionErrorMessage(err);
      setActionError(message);
      toast.error(message);
      query.reload();
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  async function complete(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (submitting.current) return;
    const trimmedNote = note.trim();
    if ((outcome === "fail" && !trimmedNote) || trimmedNote.length > 500) {
      const message = !trimmedNote
        ? "Indiquez une raison d’échec."
        : "Le texte ne doit pas dépasser 500 caractères.";
      setActionError(message);
      toast.error(message);
      return;
    }
    submitting.current = true;
    setPending(true);
    setActionError(null);
    try {
      if (outcome === "deliver") {
        await MissionsService.deliver(
          id,
          trimmedNote ? { comment: trimmedNote } : {},
        );
        toast.success("Livraison confirmée.");
      } else {
        await MissionsService.fail(id, { reason: trimmedNote });
        toast.success("Échec enregistré.");
      }
      setNote("");
    } catch (err: unknown) {
      const message = missionErrorMessage(err);
      setActionError(message);
      toast.error(message);
      query.reload();
    } finally {
      submitting.current = false;
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
            <MissionTimeline mission={mission} />
            <section
              aria-label="Trajet"
              className="panel space-y-6 break-words border-t-4 border-t-primary"
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
            <MissionHistory mission={mission} />
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
              <form onSubmit={complete} className="panel space-y-4">
                <h2 className="font-semibold">Terminer la mission</h2>
                <FormField label="Résultat">
                  <select
                    disabled={pending}
                    value={outcome}
                    onChange={(e) => {
                      setOutcome(e.target.value as "deliver" | "fail");
                      setNote("");
                      setActionError(null);
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
                    disabled={pending}
                    rows={3}
                    maxLength={500}
                    required={outcome === "fail"}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </FormField>
                <Button
                  className="min-h-14 w-full"
                  type="submit"
                  disabled={pending || (outcome === "fail" && !note.trim())}
                >
                  <PackageCheck aria-hidden />
                  {pending
                    ? "Enregistrement…"
                    : outcome === "deliver"
                      ? "Confirmer la livraison"
                      : "Signaler l’échec"}
                </Button>
              </form>
            )}
          </>
        )}
      </QueryStatus>
    </div>
  );
}
