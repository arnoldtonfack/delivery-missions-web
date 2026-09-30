"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent, type ReactNode } from "react";
import { ArrowRight, MapPin, Plus, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { QueryStatus } from "@/components/QueryStatus";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDrivers } from "@/modules/drivers/hooks";
import { driverErrorMessage } from "@/modules/drivers/errors";
import { businessToday, formatDay } from "@/lib/format";
import { useMissions } from "../hooks";
import { missionErrorMessage } from "../errors";
import {
  DRIVER_ACTIONS,
  MISSION_STATUSES,
  MISSION_STATUS_LABEL,
} from "../status";
import type { MissionStatus } from "../types";
import { MissionOverview } from "./MissionOverview";
import { MissionStatusBadge } from "./MissionStatusBadge";

export function DispatchMissionList(): ReactNode {
  // Vide = toutes les dates (plus récentes d'abord) ; le filtre restreint à un jour.
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<MissionStatus | "">("");
  const [driverId, setDriverId] = useState("");
  const drivers = useDrivers();
  const router = useRouter();
  // Toute la ligne ouvre le détail ; le lien de la référence reste l'accès clavier.
  const openMission = (event: MouseEvent<HTMLTableRowElement>, id: string): void => {
    if (event.target instanceof Element && event.target.closest("a")) return;
    router.push(`/dispatch/missions/${id}`);
  };
  const query = useMissions({
    date: date || undefined,
    status: status || undefined,
    driverId: driverId || undefined,
  });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vos opérations, en un regard."
        description="Organisez les livraisons et suivez leur progression."
        actions={
          <Button asChild>
            <Link href="/dispatch/missions/new">
              <Plus aria-hidden />
              Nouvelle mission
            </Link>
          </Button>
        }
      />
      {!query.loading && !query.error && query.data && (
        <MissionOverview missions={query.data} />
      )}
      <section
        aria-label="Filtres des missions"
        className="panel grid gap-4 md:grid-cols-3"
      >
        <FormField label="Date de livraison">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormField>
        <FormField label="Statut">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MissionStatus | "")}
          >
            <option value="">Tous les statuts</option>
            {MISSION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {MISSION_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </FormField>
        <QueryStatus
          loading={drivers.loading}
          error={drivers.error ? driverErrorMessage(drivers.error) : null}
          onRetry={drivers.reload}
        >
          <FormField label="Chauffeur">
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            >
              <option value="">Tous les chauffeurs</option>
              {drivers.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName}
                  {!d.isActive ? " (inactif)" : ""}
                </option>
              ))}
            </select>
          </FormField>
        </QueryStatus>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">
          {date ? formatDay(date) : "Toutes les dates"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {date ? (
            <Button variant="outline" onClick={() => setDate("")}>
              Toutes les dates
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setDate(businessToday())}>
              Aujourd’hui
            </Button>
          )}
          <Button
            variant="outline"
            onClick={query.reload}
            disabled={query.loading}
          >
            <RefreshCw aria-hidden />
            Actualiser
          </Button>
        </div>
      </div>
      <QueryStatus
        loading={query.loading}
        error={query.error ? missionErrorMessage(query.error) : null}
        onRetry={query.reload}
      >
        {!query.data?.length ? (
          <EmptyState
            title="Aucune mission"
            description="Aucune livraison ne correspond à ces filtres."
          />
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="border-b bg-muted text-muted-foreground">
                  <tr>
                    {[
                      "Mission / client",
                      "Date",
                      "Destination",
                      "Chauffeur",
                      "Statut",
                    ].map((h) => (
                      <th className="p-4 font-medium" key={h}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {query.data.map((m) => (
                    <tr
                      key={m.id}
                      className="cursor-pointer border-b last:border-0 hover:bg-muted/50"
                      onClick={(event) => openMission(event, m.id)}
                    >
                      <td className="break-words p-4">
                        <Link
                          className="inline-flex min-h-12 items-center text-xs font-semibold tracking-wide text-primary underline-offset-4 hover:underline"
                          href={`/dispatch/missions/${m.id}`}
                        >
                          {m.reference}
                        </Link>
                        <p className="font-medium">{m.customerName}</p>
                      </td>
                      <td className="p-4">{formatDay(m.plannedDate)}</td>
                      <td className="break-words p-4">{m.deliveryAddress}</td>
                      <td className="break-words p-4">{m.driver.fullName}</td>
                      <td className="p-4">
                        <MissionStatusBadge status={m.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 md:hidden">
              {query.data.map((m) => (
                <Link
                  className="panel grid gap-3 break-words"
                  href={`/dispatch/missions/${m.id}`}
                  key={m.id}
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <strong>{m.reference}</strong>
                    <MissionStatusBadge status={m.status} />
                  </div>
                  <p className="font-medium">{m.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDay(m.plannedDate)} · {m.deliveryAddress}
                  </p>
                  <p className="text-sm">{m.driver.fullName} →</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </QueryStatus>
    </div>
  );
}

export function DriverMissionList(): ReactNode {
  const query = useMissions();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ma tournée"
        description="Vos missions du jour, une étape à la fois."
      />
      {!query.loading && !query.error && query.data && (
        <MissionOverview missions={query.data} driver />
      )}
      <Button variant="outline" onClick={query.reload} disabled={query.loading}>
        <RefreshCw aria-hidden />
        Actualiser
      </Button>
      <QueryStatus
        loading={query.loading}
        error={query.error ? missionErrorMessage(query.error) : null}
        onRetry={query.reload}
      >
        {!query.data?.length ? (
          <EmptyState
            title="Aucune mission aujourd’hui"
            description="Vos prochaines livraisons apparaîtront ici."
          />
        ) : (
          <div className="grid gap-4">
            {query.data.map((m) => (
              <article
                className="panel space-y-5 break-words border-l-4 border-l-primary"
                key={m.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                    {m.reference}
                  </span>
                  <MissionStatusBadge status={m.status} />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {m.customerName}
                </h2>
                <p className="flex items-start gap-2">
                  <MapPin
                    className="mt-1 size-5 shrink-0 text-primary"
                    aria-hidden
                  />
                  {m.deliveryAddress}
                </p>
                <Button
                  asChild
                  className="w-full justify-between"
                  variant={
                    DRIVER_ACTIONS[m.status].length ? "default" : "outline"
                  }
                >
                  <Link href={`/driver/missions/${m.id}`}>
                    {DRIVER_ACTIONS[m.status].includes("start")
                      ? "Voir et démarrer"
                      : DRIVER_ACTIONS[m.status].length
                        ? "Continuer la mission"
                        : "Voir le détail"}
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </QueryStatus>
    </div>
  );
}
