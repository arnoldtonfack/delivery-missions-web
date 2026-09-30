/** Miroir des DTO de l'API (`src/modules/missions/dto`). Dates en ISO 8601. */

export type MissionStatus = "PLANNED" | "STARTED" | "DELIVERED" | "FAILED";

/** Référence courte à un utilisateur (`UserSummaryDto`). */
export interface UserSummary {
  readonly id: string;
  readonly fullName: string;
}

export interface Mission {
  readonly id: string;
  readonly reference: string;
  readonly customerName: string;
  readonly pickupAddress: string;
  readonly deliveryAddress: string;
  /** Jour prévu, `YYYY-MM-DD`. */
  readonly plannedDate: string;
  readonly status: MissionStatus;
  readonly failureReason: string | null;
  readonly deliveryComment: string | null;
  readonly startedAt: string | null;
  readonly completedAt: string | null;
  readonly driver: UserSummary;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MissionStatusHistoryEntry {
  readonly id: string;
  /** `null` pour l'entrée de création. */
  readonly fromStatus: MissionStatus | null;
  readonly toStatus: MissionStatus;
  readonly note: string | null;
  readonly actor: UserSummary;
  readonly createdAt: string;
}

export interface MissionDetail extends Mission {
  /** Du plus ancien au plus récent. */
  readonly statusHistory: readonly MissionStatusHistoryEntry[];
}

export interface CreateMissionPayload {
  readonly reference: string;
  readonly customerName: string;
  readonly pickupAddress: string;
  readonly deliveryAddress: string;
  /** `YYYY-MM-DD`, aujourd'hui ou plus tard. */
  readonly plannedDate: string;
  readonly driverId: string;
}

export type UpdateMissionPayload = Partial<CreateMissionPayload>;

export interface MissionsQuery {
  /** `YYYY-MM-DD` ; absent = aujourd'hui (fuseau Africa/Douala, côté API). */
  readonly date?: string;
  /** Ignoré pour un chauffeur : l'API le remplace par son propre id. */
  readonly driverId?: string;
  readonly status?: MissionStatus;
}
