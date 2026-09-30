"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import { useAuthStore } from "../store";

export function LogoutButton(): ReactNode {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <Button
      variant="ghost"
      aria-label="Déconnexion"
      className="min-w-12"
      onClick={() => {
        logout();
        router.replace("/login");
      }}
    >
      <LogOut className="size-5" aria-hidden />
      <span className="hidden md:inline">Déconnexion</span>
    </Button>
  );
}
