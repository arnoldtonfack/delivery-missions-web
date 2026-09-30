"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import { useAuthStore } from "../store";

export function LogoutButton(): ReactNode {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <Button
      variant="outline"
      onClick={() => {
        logout();
        router.replace("/login");
      }}
    >
      Déconnexion
    </Button>
  );
}
