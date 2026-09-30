import type { ReactNode } from "react";

// À construire : détail, modification et historique des statuts — MissionsService.get/update
export default async function MissionDetailPage({
  params,
}: PageProps<"/dispatch/missions/[id]">): Promise<ReactNode> {
  const { id } = await params;
  return <h1>Mission {id}</h1>;
}
