// Stamps the visitor's country (from Vercel's geo header) into a cookie so the
// cookie banner can pick opt-in vs notice without making pages dynamic.
import { NextResponse, type NextRequest } from "next/server";
import { GEO_COOKIE } from "@/lib/consent";

export function proxy(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  const res = NextResponse.next();
  if (country && /^[A-Z]{2}$/.test(country) && request.cookies.get(GEO_COOKIE)?.value !== country) {
    res.cookies.set(GEO_COOKIE, country, { path: "/", sameSite: "lax", secure: true, maxAge: 60 * 60 * 24 });
  }
  return res;
}

export const config = {
  // Pages only: skip Next internals, API routes and static files.
  matcher: ["/((?!_next/|api/|.*\\.[a-z0-9]+$).*)"],
};
