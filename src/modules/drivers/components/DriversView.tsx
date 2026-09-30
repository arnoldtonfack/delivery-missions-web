"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CircleCheck, CirclePause, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { QueryStatus } from "@/components/QueryStatus";
import { EmptyState } from "@/components/EmptyState";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDrivers } from "../hooks";
import { DriversService } from "../module";
import { driverErrorMessage } from "../errors";
import type { Driver } from "../types";

export function DriversView(): ReactNode {
  const query = useDrivers();
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function create(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName")).trim();
    const password = String(form.get("password"));
    if (!fullName || new TextEncoder().encode(password).length > 72) {
      setError("Renseignez un nom et un mot de passe de 72 octets maximum.");
      return;
    }
    setPending("create");
    setError(null);
    try {
      await DriversService.create({
        fullName,
        email: String(form.get("email")).trim(),
        password,
      });
      toast.success("Chauffeur créé.");
      setCreating(false);
      query.reload();
    } catch (err: unknown) {
      const message = driverErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setPending(null);
    }
  }
  async function toggle(driver: Driver): Promise<void> {
    if (pending) return;
    setPending(driver.id);
    try {
      await DriversService.setActive(driver.id, !driver.isActive);
      toast.success(
        driver.isActive ? "Chauffeur désactivé." : "Chauffeur activé.",
      );
      query.reload();
    } catch (err: unknown) {
      toast.error(driverErrorMessage(err));
    } finally {
      setPending(null);
    }
  }
  function action(driver: Driver): ReactNode {
    return (
      <Button
        variant="outline"
        disabled={pending !== null || query.loading}
        onClick={() => toggle(driver)}
        aria-label={`${driver.isActive ? "Désactiver" : "Activer"} ${driver.fullName}`}
      >
        {pending === driver.id
          ? "Enregistrement…"
          : driver.isActive
            ? "Désactiver"
            : "Activer"}
      </Button>
    );
  }
  function status(driver: Driver): ReactNode {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        {driver.isActive ? (
          <CircleCheck className="size-4 text-primary" aria-hidden />
        ) : (
          <CirclePause className="size-4 text-muted-foreground" aria-hidden />
        )}
        {driver.isActive ? "Actif" : "Inactif"}
      </span>
    );
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title="Chauffeurs"
        description="Gérez votre équipe et les accès à l’application."
        actions={
          <Button
            onClick={() => {
              setCreating(!creating);
              setError(null);
            }}
            disabled={pending !== null}
          >
            <Plus aria-hidden />
            {creating ? "Fermer" : "Nouveau chauffeur"}
          </Button>
        }
      />
      {creating && (
        <form onSubmit={create} className="panel space-y-4">
          <h2 className="font-semibold">Créer un compte chauffeur</h2>
          <fieldset
            disabled={pending !== null}
            className="grid gap-4 md:grid-cols-3"
          >
            <FormField label="Nom complet">
              <Input
                name="fullName"
                required
                maxLength={100}
                autoComplete="name"
              />
            </FormField>
            <FormField label="E-mail">
              <Input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
              />
            </FormField>
            <FormField label="Mot de passe initial">
              <Input
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
              />
            </FormField>
          </fieldset>
          <p className="text-sm text-muted-foreground">
            Au moins 8 caractères. Communiquez ce mot de passe au chauffeur.
          </p>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending !== null}>
            {pending === "create" ? "Création…" : "Créer le chauffeur"}
          </Button>
        </form>
      )}
      <QueryStatus
        loading={query.loading}
        error={query.error ? driverErrorMessage(query.error) : null}
        onRetry={query.reload}
      >
        {!query.data?.length ? (
          <EmptyState
            title="Aucun chauffeur"
            description="Ajoutez votre premier chauffeur pour lui assigner des missions."
          />
        ) : (
          <>
            <div className="hidden rounded-xl border bg-card md:block">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="border-b bg-muted text-muted-foreground">
                  <tr>
                    {["Chauffeur", "E-mail", "Compte", "Action"].map((h) => (
                      <th key={h} className="p-4 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {query.data.map((d) => (
                    <tr key={d.id} className="border-b last:border-0">
                      <td className="break-words p-4 font-semibold">
                        {d.fullName}
                      </td>
                      <td className="break-words p-4">{d.email}</td>
                      <td className="p-4">{status(d)}</td>
                      <td className="p-4">{action(d)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 md:hidden">
              {query.data.map((d) => (
                <article className="panel space-y-3 break-words" key={d.id}>
                  <h2 className="font-semibold">{d.fullName}</h2>
                  <p className="text-sm text-muted-foreground">{d.email}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {status(d)}
                    {action(d)}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </QueryStatus>
    </div>
  );
}
