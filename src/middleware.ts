import { auth } from "@/services/auth";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { AllLocales, AppConfig } from "./utils/AppConfig";

const adminRoutes = [
  "/access/roles",
  "/access/users",
  "/logs/orders-logs",
  "/logs/activities-logs",
  "/access/logs",
];

const intlMiddleware = createIntlMiddleware({
  locales: AllLocales,
  // localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const middleware = auth((req: any) => {
  const session = req?.auth;
  const isAdmin = session?.user?.roleId === "1";

  const isLoginOrSignupPage =
    req.nextUrl.pathname.includes("/login") ||
    req.nextUrl.pathname.includes("/signUp");

  if (!session && !isLoginOrSignupPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (session && isLoginOrSignupPage) {
    if (isAdmin) {
      return NextResponse.redirect(
        new URL("/marketplace/dashboard", req.nextUrl),
      );
    } else if (session?.user?.userType === "partner") {
      return NextResponse.redirect(
        new URL("/marketplace/partners/dashboard", req.nextUrl),
      );
    }
  }

  if (session && !isAdmin && adminRoutes.includes(req.nextUrl.pathname)) {
    if (session?.user?.userType === "partner") {
      return NextResponse.redirect(
        new URL("/marketplace/partners/dashboard", req.nextUrl),
      );
    }
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

export default middleware;
