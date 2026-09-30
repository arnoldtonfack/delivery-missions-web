import type { ReactNode } from "react";
import { MissionDetailView } from "@/modules/missions/components/MissionDetailView";
export default async function Page({
  params,
}: PageProps<"/dispatch/missions/[id]">): Promise<ReactNode> {
  const { id } = await params;
  return <MissionDetailView key={id} id={id} />;
}
