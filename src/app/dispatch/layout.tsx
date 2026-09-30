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
      <nav
        aria-label="Navigation dispatcher"
        className="flex gap-6 border-b bg-card px-4 font-medium md:px-8 [&_a]:flex [&_a]:min-h-12 [&_a]:items-center [&_a]:text-primary"
      >
        <Link href="/dispatch">Missions</Link>
        <Link href="/dispatch/drivers">Chauffeurs</Link>
      </nav>
      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 p-4 md:p-8">
        {children}
      </main>
    </RoleGuard>
  );
}
