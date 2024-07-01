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
  // localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const middleware = auth((req: any) => {
  const session = req?.auth;

  const isLoginPage = req.nextUrl.pathname.includes("/login");
  const isAdmin = session?.user?.roleCode === "ADMIN";

  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
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
