import type { ReactNode } from "react";
import { Package, MapPin, Check, ArrowRight, Truck } from "lucide-react";
import { AppEnv } from "@/config/env";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function LoginPage(): ReactNode {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="brand-surface relative hidden flex-col justify-between overflow-hidden p-12 lg:flex xl:p-16">
        <div className="relative z-10 flex items-center gap-3 text-lg font-semibold">
          <Package className="size-8" aria-hidden />
          {AppEnv.appName}
        </div>
        <div className="relative z-10 my-12 max-w-lg">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]">
            De la mission à la livraison
          </p>
          <h2 className="text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
            Vos équipes avancent.
            <br />
            Vos livraisons aussi.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed">
            Un espace clair pour organiser les missions. Un parcours simple pour
            les réaliser.
          </p>
          <ol className="mt-12 grid grid-cols-3 gap-3 border-t border-current/25 pt-8">
            {[
              { icon: MapPin, label: "Planifier" },
              { icon: Truck, label: "Acheminer" },
              { icon: Check, label: "Livrer" },
            ].map(({ icon: Icon, label }, i) => (
              <li key={label}>
                <Icon className="mb-4 size-6" aria-hidden />
                <p className="text-xs">0{i + 1}</p>
                <p className="mt-1 font-medium">{label}</p>
              </li>
            ))}
          </ol>
        </div>
        <p className="relative z-10 text-xs">
          CAMTRACK · Gestion des missions de livraison
        </p>
      </section>
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Package className="size-7" aria-hidden />
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Votre espace livraison
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Bon retour.</h1>
          <p className="mt-4 mb-8 text-sm leading-relaxed text-muted-foreground">
            Connectez-vous pour retrouver vos missions et garder le cap sur
            votre journée.
          </p>
          <LoginForm />
          <div className="mt-8 flex items-start gap-3 border-t pt-6 text-xs leading-relaxed text-muted-foreground">
            <ArrowRight className="size-4 shrink-0" aria-hidden />
            <p>Un accès personnel, un espace adapté à votre rôle.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
