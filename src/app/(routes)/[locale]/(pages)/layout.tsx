import Footer from "@/components/blocks/Footer";
import { ReactNode } from "react";
import Sidebar from "@/components/blocks/Sidebar";
import TopNavBar from "@/components/blocks/TopNavBar";

type Props = {
  children?: ReactNode;
};

const PagesLayout = ({ children }: Props) => {
  return (
    <>
      <TopNavBar />
      <Sidebar />
      <div className="flex h-screen w-screen flex-col bg-n20 pl-[280px] pt-[90px]  dark:bg-bg3 xxxl:pl-[336px]  ">
        <div className=" flex flex-grow flex-col overflow-x-hidden p-4 ">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PagesLayout;
