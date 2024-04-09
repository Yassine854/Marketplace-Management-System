import { NextIntlClientProvider, useMessages } from "next-intl";
import { LayoutProvider } from "@/utils/LayoutContext";
import ThemeProvider from "@/utils/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Next13NProgress } from "nextjs13-progress";
import "./globals.css";

type PageParamsType = {
  locale: string;
};
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kamioun OMS",
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: PageParamsType;
}) {
  const messages = useMessages();

  return (
    <html lang={locale} className="!scroll-smooth">
      <body className={`${inter.className} text-n500 dark:text-n30`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <Next13NProgress color="#5D69F4" height={3} />
            <LayoutProvider>{children}</LayoutProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
