"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField } from "@/components/FormField";
import { QueryStatus } from "@/components/QueryStatus";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDrivers } from "@/modules/drivers/hooks";
import { driverErrorMessage } from "@/modules/drivers/errors";
import { businessToday } from "@/lib/format";
import { MissionsService } from "../module";
import { missionErrorMessage } from "../errors";
import type { Mission, CreateMissionPayload } from "../types";

export function MissionForm({
  mission,
  onSaved,
}: {
  readonly mission?: Mission;
  readonly onSaved?: () => void;
}): ReactNode {
  const router = useRouter();
  const drivers = useDrivers({ isActive: true });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const payload: CreateMissionPayload = {
      reference: String(form.get("reference")).trim().toUpperCase(),
      customerName: String(form.get("customerName")).trim(),
      pickupAddress: String(form.get("pickupAddress")).trim(),
      deliveryAddress: String(form.get("deliveryAddress")).trim(),
      plannedDate: String(form.get("plannedDate")),
      driverId: String(form.get("driverId")),
    };
    if (
      !payload.customerName ||
      !payload.pickupAddress ||
      !payload.deliveryAddress
    ) {
      setError("Renseignez le client et les deux adresses.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      if (mission) {
        await MissionsService.update(mission.id, payload);
        toast.success("Mission modifiée.");
        onSaved?.();
      } else {
        const created = await MissionsService.create(payload);
        toast.success("Mission créée.");
        router.push(`/dispatch/missions/${created.id}`);
      }
    } catch (err: unknown) {
      const message = missionErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }
  return (
    <QueryStatus
      loading={drivers.loading}
      error={drivers.error ? driverErrorMessage(drivers.error) : null}
      onRetry={drivers.reload}
    >
      {!drivers.data?.length ? (
        <EmptyState
          title="Aucun chauffeur actif"
          description="Créez ou activez un chauffeur avant d’assigner une mission."
        />
      ) : (
        <form onSubmit={submit} className="panel space-y-5">
          <fieldset disabled={pending} className="grid gap-5 md:grid-cols-2">
            <FormField label="Référence">
              <Input
                name="reference"
                required
                maxLength={40}
                pattern="[A-Za-z0-9][A-Za-z0-9._\x2F\x2D]*"
                title="Lettres, chiffres, point, tiret, barre oblique et soulignement."
                defaultValue={mission?.reference}
                placeholder="CMD-2026-001"
              />
            </FormField>
            <FormField label="Client">
              <Input
                name="customerName"
                required
                maxLength={120}
                defaultValue={mission?.customerName}
              />
            </FormField>
            <FormField label="Adresse de retrait">
              <Input
                name="pickupAddress"
                required
                maxLength={255}
                defaultValue={mission?.pickupAddress}
              />
            </FormField>
            <FormField label="Adresse de livraison">
              <Input
                name="deliveryAddress"
                required
                maxLength={255}
                defaultValue={mission?.deliveryAddress}
              />
            </FormField>
            <FormField label="Date de livraison">
              <Input
                name="plannedDate"
                type="date"
                required
                min={businessToday()}
                defaultValue={mission?.plannedDate ?? businessToday()}
              />
            </FormField>
            <FormField label="Chauffeur assigné">
              <select
                name="driverId"
                required
                defaultValue={mission?.driver.id ?? ""}
              >
                <option value="" disabled>
                  Choisir un chauffeur
                </option>
                {mission &&
                  !drivers.data.some((d) => d.id === mission.driver.id) && (
                    <option value={mission.driver.id} disabled>
                      {mission.driver.fullName} (inactif : réassigner)
                    </option>
                  )}
                {drivers.data.map((d) => (
                  <option value={d.id} key={d.id}>
                    {d.fullName}
                  </option>
                ))}
              </select>
            </FormField>
          </fieldset>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending
              ? "Enregistrement…"
              : mission
                ? "Enregistrer les modifications"
                : "Créer la mission"}
          </Button>
        </form>
      )}
    </QueryStatus>
  );
}
