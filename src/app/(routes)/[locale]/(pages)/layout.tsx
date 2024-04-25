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
      <div className="flex h-screen w-screen flex-col bg-n30 pl-[280px] pt-[70px]  dark:bg-bg3   ">
        <div className=" flex flex-grow flex-col overflow-x-hidden p-3 ">
          {children}
        </div>
      </div>
    </>
  );
};

export default PagesLayout;
