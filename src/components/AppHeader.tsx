"use client";

import type { ReactNode } from "react";

import { AppEnv } from "@/config/env";
import { LogoutButton } from "@/modules/auth/components/LogoutButton";
import { useAuthStore } from "@/modules/auth/store";

/** En-tête commun aux deux espaces : application, utilisateur, déconnexion. */
export function AppHeader(): ReactNode {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-3 md:px-8">
      <span className="font-semibold tracking-tight text-primary">
        {AppEnv.appName}
      </span>
      <div className="flex items-center gap-3">
        <span className="max-w-36 truncate text-sm text-muted-foreground">
          {user?.fullName}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
