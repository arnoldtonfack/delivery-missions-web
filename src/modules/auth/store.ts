import { create } from "zustand";
import { persist } from "zustand/middleware";

import { syncSessionCookie } from "./session";
import type { LoginResponse, User } from "./types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  /** Instant d'expiration du jeton (ms epoch). */
  expiresAt: number | null;
  /** `true` une fois le `localStorage` relu : avant, l'état est encore vide. */
  hydrated: boolean;

  setSession: (login: LoginResponse) => void;
  logout: () => void;
}

const EMPTY_SESSION = { user: null, accessToken: null, expiresAt: null };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...EMPTY_SESSION,
      hydrated: false,

      setSession: ({ user, accessToken, expiresIn }) => {
        syncSessionCookie(user.role, expiresIn);
        set({ user, accessToken, expiresAt: Date.now() + expiresIn * 1000 });
      },

      logout: () => {
        syncSessionCookie(null);
        set(EMPTY_SESSION);
      },
    }),
    {
      name: "delivery-missions-auth",
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        expiresAt: s.expiresAt,
      }),
      /**
       * Au démarrage, le store devient l'unique source de vérité : une session
       * expirée est purgée et le cookie du proxy est réaligné. Sans cela, un
       * cookie sans store (ou l'inverse) ferait boucler les redirections.
       */
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const remainingMs = (state.expiresAt ?? 0) - Date.now();
        if (state.user && remainingMs > 0) {
          syncSessionCookie(state.user.role, Math.floor(remainingMs / 1000));
        } else {
          state.logout();
        }
        useAuthStore.setState({ hydrated: true });
      },
    },
  ),
);
