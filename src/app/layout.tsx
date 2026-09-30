import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { AppEnv } from "@/config/env";

import "./globals.css";

// `--font-sans` est la variable attendue par `globals.css` (thème shadcn).
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: AppEnv.appName,
  description: "Gestion des missions de livraison — dispatchers et chauffeurs",
};

export default function RootLayout({ children }: LayoutProps<"/">): ReactNode {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
