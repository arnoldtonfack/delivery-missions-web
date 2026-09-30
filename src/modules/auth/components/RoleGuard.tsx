"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { homePathFor } from "../session";
import { useAuthStore } from "../store";
import type { Role } from "../types";

interface RoleGuardProps {
  readonly role: Role;
  readonly children: ReactNode;
}

/**
 * Garde côté client, complément du proxy : couvre la déconnexion en cours de
 * session (401 → store vidé) et une session expirée dans `localStorage`.
 * N'affiche rien tant que le store n'est pas relu, pour éviter un flash.
 */
export function RoleGuard({ role, children }: RoleGuardProps): ReactNode {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  const allowed = user?.role === role;

  useEffect(() => {
    if (!hydrated || allowed) return;
    router.replace(user ? homePathFor(user.role) : "/login");
  }, [hydrated, allowed, user, router]);

  return hydrated && allowed ? children : null;
}
