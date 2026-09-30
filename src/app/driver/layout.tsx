import type { ReactNode } from "react";

import { AppHeader } from "@/components/AppHeader";
import { RoleGuard } from "@/modules/auth/components/RoleGuard";

/** Espace chauffeur : pensé mobile d'abord (une colonne, actions en gros boutons). */
export default function DriverLayout({
  children,
}: LayoutProps<"/driver">): ReactNode {
  return (
    <RoleGuard role="DRIVER">
      <AppHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 sm:p-6">
        {children}
      </main>
    </RoleGuard>
  );
}
