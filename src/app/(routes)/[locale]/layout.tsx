"use client";

import "../globals.css";
import "@/public/styles/style.scss";

import { ApolloProviderWrapper } from "@/libs/apollo-provider-wrapper";
import { Inter } from "next/font/google";
import { LayoutProvider } from "@/utils/LayoutContext";
import type { Metadata } from "next";
import { Next13NProgress } from "nextjs13-progress";
import NextAuthSessionProvider from "@/libs/SessionProvider";
import { ReactQueryClientProvider } from "@/libs/ReactQueryClientProvider";
import ThemeProvider from "@/utils/ThemeProvider";

type PageParamsType = {
  locale: string;
};
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
        <NextAuthSessionProvider>
          <ApolloProviderWrapper>
            <ReactQueryClientProvider>
              <ThemeProvider>
                <Next13NProgress color="#5D69F4" height={3} />
                <LayoutProvider>{children}</LayoutProvider>
              </ThemeProvider>
            </ReactQueryClientProvider>
          </ApolloProviderWrapper>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
