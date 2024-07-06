import "@/public/styles/globals.css";
import "@/public/styles/style.scss";

import { Inter } from "next/font/google";
import { LayoutProvider } from "@/utils/LayoutContext";
import type { Metadata } from "next";
import { Next13NProgress } from "nextjs13-progress";
import ThemeProvider from "@/utils/ThemeProvider";
import { NextUIProvider } from "@nextui-org/react";

type PageParamsType = {
  locale: string;
};
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: "Kamioun - Order Management System",
};

const RootLayout = ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: PageParamsType;
}) => {
  return (
    <html suppressHydrationWarning lang={locale} className="!scroll-smooth">
      <body className={`${inter.className}   text-n500  dark:text-n30 `}>
        <ThemeProvider>
          <Next13NProgress color="#5D69F4" height={3} />
          <LayoutProvider>
            <NextUIProvider locale="fr-FR">{children}</NextUIProvider>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
