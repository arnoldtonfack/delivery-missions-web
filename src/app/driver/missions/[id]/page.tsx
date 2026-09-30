import type { ReactNode } from "react";

// À construire : détail + prochaine action de statut autorisée
export default async function DriverMissionPage({
  params,
}: PageProps<"/driver/missions/[id]">): Promise<ReactNode> {
  const { id } = await params;
  return <h1>Mission {id}</h1>;
}
