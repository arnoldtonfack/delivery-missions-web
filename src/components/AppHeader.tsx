"use client";

import type { ReactNode } from "react";

import { AppEnv } from "@/config/env";
import { LogoutButton } from "@/modules/auth/components/LogoutButton";
import { useAuthStore } from "@/modules/auth/store";

/** En-tête commun aux deux espaces : application, utilisateur, déconnexion. */
export function AppHeader(): ReactNode {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex items-center justify-between gap-4 border-b p-4">
      <span className="font-semibold">{AppEnv.appName}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm">{user?.fullName}</span>
        <LogoutButton />
      </div>
    </header>
  );
}
