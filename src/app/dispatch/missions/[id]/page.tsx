import type { ReactNode } from "react";

// À construire : détail + historique (useMission), modification si PLANNED (MissionsService.update)
export default async function MissionDetailPage({
  params,
}: PageProps<"/dispatch/missions/[id]">): Promise<ReactNode> {
  const { id } = await params;
  return <h1>Mission {id}</h1>;
}
