// middleware.ts
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const lowerPathname = pathname.toLowerCase();

    const isAdminRoute =
      lowerPathname === "/admin" || lowerPathname.startsWith("/admin/");

    const isAdminApiRoute = lowerPathname.startsWith("/admin/api/");

    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";

    if (!token || !isAdmin) {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/Admin",
    "/Admin/:path*",
    "/admin",
    "/admin/:path*",
  ],
};