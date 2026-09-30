/** Miroir des DTO de l'API (`UserResponseDto`, `LoginDto`, `LoginResponseDto`). */

export type Role = "DISPATCHER" | "DRIVER";

export interface User {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly role: Role;
  readonly isActive: boolean;
  readonly createdAt: string;
}

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly accessToken: string;
  readonly tokenType: "Bearer";
  /** Durée de validité du jeton, en secondes. */
  readonly expiresIn: number;
  readonly user: User;
}
