import { AllLocales, AppConfig } from "./utils/AppConfig";

import { NextResponse } from "next/server";
import { auth } from "@/services/auth";
import createIntlMiddleware from "next-intl/middleware";

const adminRoutes = [
  "/logs/orders-logs",
  "/access/roles",
  "/access/users",
  "/logs/activities-logs",
];

const intlMiddleware = createIntlMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const middleware = auth((req: any) => {
  const isAuthPage = req.nextUrl.pathname !== "/login";
  //testPathnameRegex(authPages, req.nextUrl.pathname);
  const session = req?.auth;
  const isAdmin = session?.user?.role === "ADMIN";

  // Redirect to sign-in page if not authenticated
  if (!session && isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to home page if authenticated and trying to access auth pages
  if (session && !isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (session && !isAdmin && adminRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

export default middleware;
