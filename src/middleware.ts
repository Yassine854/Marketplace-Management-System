import { AllLocales, AppConfig } from "./utils/AppConfig";

import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

export default intlMiddleware;

export const config = {
  // Skip paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
