import type { ReactNode } from "react";

export function FormField({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}): ReactNode {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
