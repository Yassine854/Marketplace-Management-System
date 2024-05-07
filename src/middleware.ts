import { AllLocales, AppConfig } from "./utils/AppConfig";

import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const middleware = auth((req: any) => {
  const isAuthPage = req.nextUrl.pathname !== "/login";
  //testPathnameRegex(authPages, req.nextUrl.pathname);
  const session = req?.auth;

  // Redirect to sign-in page if not authenticated
  if (!session && isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to home page if authenticated and trying to access auth pages
  if (session && !isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

export default middleware;
