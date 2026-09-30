"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LayoutDashboard, Users, Route } from "lucide-react";
import type { ReactNode } from "react";

export function DispatchNav(): ReactNode {
  const pathname = usePathname();
  return (
    <aside className="border-b bg-card p-3 lg:sticky lg:top-0 lg:flex lg:h-[calc(100dvh-81px)] lg:flex-col lg:border-r lg:border-b-0 lg:p-5">
      <p className="mb-4 hidden px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground lg:block">
        Espace de travail
      </p>
      <nav
        aria-label="Navigation dispatcher"
        className="grid grid-cols-2 gap-2 lg:grid-cols-1"
      >
        {[
          {
            href: "/dispatch",
            label: "Missions",
            icon: LayoutDashboard,
            active: !pathname.startsWith("/dispatch/drivers"),
          },
          {
            href: "/dispatch/drivers",
            label: "Chauffeurs",
            icon: Users,
            active: pathname.startsWith("/dispatch/drivers"),
          },
        ].map(({ href, label, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Icon className="size-5" aria-hidden />
            {label}
            {active && <ArrowUpRight className="ml-auto size-4" aria-hidden />}
          </Link>
        ))}
      </nav>
      <div className="mt-auto hidden rounded-2xl border bg-background p-4 lg:block">
        <Route className="mb-3 size-6 text-primary" aria-hidden />
        <p className="text-sm font-semibold">Chaque étape compte.</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Planifiez, assignez et suivez vos livraisons depuis un seul espace.
        </p>
      </div>
    </aside>
  );
}
