import { ReactNode } from "react";
import Sidebar from "@/components/blocks/Sidebar";
import TopNavBar from "@/components/blocks/TopNavBar";

type Props = {
  children?: ReactNode;
};

const PagesLayout = ({ children }: Props) => {
  return (
    <div className="h-screen w-screen ">
      <TopNavBar />
      <Sidebar />
      <div className="fixed bottom-0 left-64 right-0  top-16 z-10  rounded-xl bg-n30 p-3">
        {children}
      </div>
    </div>
  );
};

export default PagesLayout;
