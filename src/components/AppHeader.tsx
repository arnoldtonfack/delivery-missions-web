"use client";
import type { ReactNode } from "react";
import { Package, UserRound } from "lucide-react";
import { AppEnv } from "@/config/env";
import { LogoutButton } from "@/modules/auth/components/LogoutButton";
import { useAuthStore } from "@/modules/auth/store";

export function AppHeader(): ReactNode {
  const user = useAuthStore((s) => s.user);
  return (
    <header className="flex min-h-20 items-center justify-between gap-3 border-b bg-card px-4 py-3 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Package className="size-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-tight sm:text-base">
            {AppEnv.appName}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {user?.role === "DRIVER"
              ? "Votre journée, en mouvement"
              : "Console de livraison"}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 md:gap-5">
        <div className="hidden items-center gap-3 sm:flex">
          <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <UserRound className="size-5" aria-hidden />
          </span>
          <div>
            <p className="max-w-40 truncate text-sm font-semibold">
              {user?.fullName}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.role === "DRIVER" ? "Chauffeur" : "Dispatcher"}
            </p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
