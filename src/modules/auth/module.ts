import { http } from "@/lib/http";

import type { LoginPayload, LoginResponse, User } from "./types";

export const AuthService = {
  login: (payload: LoginPayload): Promise<LoginResponse> =>
    http.post<LoginResponse>("/auth/login", payload, { auth: false }),

  me: (): Promise<User> => http.get<User>("/auth/me"),
};
