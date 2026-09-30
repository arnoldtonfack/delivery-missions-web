import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MissionForm } from "@/modules/missions/components/MissionForm";
export default function NewMissionPage(): ReactNode {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        className="inline-flex min-h-12 items-center text-primary"
        href="/dispatch"
      >
        ← Missions
      </Link>
      <PageHeader
        title="Nouvelle mission"
        description="Précisez le trajet et assignez un chauffeur actif."
      />
      <MissionForm />
    </div>
  );
}
