import "../globals.css";
import "@/public/styles/style.scss";

import { Inter } from "next/font/google";
import type { Metadata } from "next";

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
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
