import type { User } from "@/modules/auth/types";

/** Un chauffeur est un utilisateur de rôle DRIVER (`UserResponseDto`). */
export type Driver = User;

export interface CreateDriverPayload {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
}

export type UpdateDriverPayload = Partial<CreateDriverPayload>;

export interface DriversQuery {
  readonly isActive?: boolean;
}
