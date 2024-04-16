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
    <div className="   flex h-screen  w-screen">
      <TopNavBar />
      <Sidebar />

      <div className="h-full w-[320px] xxxl:w-[410px] " />
      <div className="  h-full w-full ">
        <div className="  flex h-full w-full flex-col">
          <div className=" h-full w-full  px-4 py-4 pt-[120px]">{children}</div>
          <Footer />
          {/* <div
            className="bg-slate-600 h-16 w-full "
          />  */}
          {/* {children} */}
          {/* <div
            className="bg-slate-600 h-16 w-full"
          > */}

          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
// w-[280px] xxxl:w-[336px]
//
// <div className=" flex bg-pink-800 pt-[120px]  ml-[280px] xxxl:ml-[336px]   w-full bg-primary/5 dark:bg-bg3  flex-col px-8  flex-grow h-full">
//   {/* {children} */}
//
// </div>

//
