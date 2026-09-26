import { NextResponse, type NextRequest } from "next/server";
import { verifySession, AUTH_COOKIE_NAME } from "@/lib/auth";

export const config = {
  matcher: ["/form-admin/:path*"],
};

const PUBLIC_PATHS = new Set(["/form-admin/login"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const ok = await verifySession(token);
  if (ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/form-admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}
