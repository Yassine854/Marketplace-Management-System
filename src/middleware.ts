import { auth } from "@/services/auth";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { AllLocales, AppConfig } from "./utils/AppConfig";

const adminRoutes = [
  "/access/roles",
  "/access/users",
  "/logs/orders-logs",
  "/logs/activities-logs",
];

const intlMiddleware = createIntlMiddleware({
  locales: AllLocales,
  // localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const middleware = auth((req: any) => {
  const session = req?.auth;

  const isAdmin = session?.user?.roleId === "1";
  const isActive = session?.user?.isActiv;
  console.log("🚀 ~ middleware ~ isActive:", isActive);

  const isLoginPage = req.nextUrl.pathname.includes("/login");

  if (session && !isActive) {
    console.log("hello");
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (session && isLoginPage) {
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
