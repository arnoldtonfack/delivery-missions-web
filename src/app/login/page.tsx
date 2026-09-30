import type { ReactNode } from "react";

import { AppEnv } from "@/config/env";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function LoginPage(): ReactNode {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-4">
      <h1 className="text-2xl font-semibold">{AppEnv.appName}</h1>
      <LoginForm />
    </main>
  );
}
