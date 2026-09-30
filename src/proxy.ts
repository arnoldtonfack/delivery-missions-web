import { NextResponse, type NextRequest } from "next/server";

import { homePathFor, isRole, SESSION_COOKIE } from "@/modules/auth/session";
import type { Role } from "@/modules/auth/types";

/**
 * Aiguillage de navigation selon le rôle (Next.js 16 — anciennement « middleware »).
 *
 * Le cookie `dm_session` (posé par le store d'auth) ne contient que le rôle : ce
 * n'est PAS une barrière de sécurité. L'API contrôle JWT et rôle à chaque appel.
 *
 * - `/` et `/login` connecté      → écran d'accueil du rôle
 * - `/dispatch/*` réservé au DISPATCHER, `/driver/*` au DRIVER
 * - zone protégée sans session    → `/login`
 */
const AREA_ROLE: ReadonlyArray<readonly [string, Role]> = [
  ["/dispatch", "DISPATCHER"],
  ["/driver", "DRIVER"],
];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const role = isRole(cookie) ? cookie : null;
  const redirect = (path: string): NextResponse =>
    NextResponse.redirect(new URL(path, request.url));

  if (pathname === "/" || pathname === "/login") {
    if (role) return redirect(homePathFor(role));
    return pathname === "/" ? redirect("/login") : NextResponse.next();
  }

  const area = AREA_ROLE.find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (area) {
    if (!role) return redirect("/login");
    if (role !== area[1]) return redirect(homePathFor(role));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dispatch/:path*", "/driver/:path*"],
};
