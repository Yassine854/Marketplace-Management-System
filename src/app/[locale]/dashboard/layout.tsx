import Footer from "@/components/blocks/Footer";
import Sidebar from "@/components/blocks/Sidebar";
import TopNavBar from "@/components/blocks/TopNavBar";
import { unstable_setRequestLocale } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

const Layout = ({ children, params: { locale } }: Props) => {
  // Ensures static rendering at build time.
  unstable_setRequestLocale(locale);

  return (
    <>
      <TopNavBar />
      <div className=" pt-[120px]  ml-[280px] xxxl:ml-[336px]   w-full bg-primary/5 dark:bg-bg3  flex-col px-8">
        {children}
        <Footer />
      </div>
      <Sidebar />
    </>
  );
};

export default Layout;
