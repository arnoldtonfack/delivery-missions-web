import Link from "next/link";
import type { ReactNode } from "react";

import { AppHeader } from "@/components/AppHeader";
import { RoleGuard } from "@/modules/auth/components/RoleGuard";

/** Espace dispatcher : console desktop. */
export default function DispatchLayout({
  children,
}: LayoutProps<"/dispatch">): ReactNode {
  return (
    <RoleGuard role="DISPATCHER">
      <AppHeader />
      <nav className="flex gap-4 border-b p-4">
        <Link href="/dispatch">Missions</Link>
        <Link href="/dispatch/drivers">Chauffeurs</Link>
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </RoleGuard>
  );
}
