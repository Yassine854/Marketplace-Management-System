import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { unstable_setRequestLocale } from "next-intl/server";

const locales = ["en", "fr"];

type Props = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const Layout = ({ children, params: { locale } }: Props) => {
  // Ensures static rendering at build time.
  unstable_setRequestLocale(locale);

  return (
    <div className="flex flex-grow bg-green-500  ">
      <TopNavBar />
      <div className="flex flex-grow mt-34 ml-80 bg-blue-400 mt-[90px]  ml-[280px] xxxl:ml-[336px]">
        {children}
      </div>
      <Sidebar />
    </div>
  );
};

export default Layout;
