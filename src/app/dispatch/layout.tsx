import { DispatchNav } from "@/components/DispatchNav";
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
      <div className="grid flex-1 lg:grid-cols-[232px_minmax(0,1fr)]">
        <DispatchNav />
        <main className="mx-auto w-full min-w-0 max-w-[1440px] p-4 py-6 md:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
