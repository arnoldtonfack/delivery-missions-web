import { CalendarClock, Truck, CircleCheck, CircleX } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

import { MISSION_STATUS_LABEL } from "../status";
import type { MissionStatus } from "../types";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const VARIANT: Readonly<Record<MissionStatus, BadgeVariant>> = {
  PLANNED: "outline",
  STARTED: "secondary",
  DELIVERED: "default",
  FAILED: "destructive",
};

/** Statut d'une mission. `data-status` permet un style par statut sans toucher au mapping. */
export function MissionStatusBadge({
  status,
}: {
  readonly status: MissionStatus;
}): ReactNode {
  const Icon = {
    PLANNED: CalendarClock,
    STARTED: Truck,
    DELIVERED: CircleCheck,
    FAILED: CircleX,
  }[status];
  return (
    <Badge variant={VARIANT[status]} data-status={status}>
      <Icon aria-hidden className="size-3.5" />
      {MISSION_STATUS_LABEL[status]}
    </Badge>
  );
}
