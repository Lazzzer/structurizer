import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname;
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const isAuth = !!session;

    if (path.startsWith("/login") || path.startsWith("/register")) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/text-recognition/:path*",
    "/data-extraction/:path*",
    "/verification/:path*",
    "/receipts/:path*",
    "/invoices/:path*",
    "/card-statements/:path*",
    "/settings/:path*",
    "/help/:path*",
    "/login",
    "/register",
  ],
};
