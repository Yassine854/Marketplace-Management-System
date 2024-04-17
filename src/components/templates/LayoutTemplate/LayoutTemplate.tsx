import Footer from "@/components/blocks/Footer";
import { ReactNode } from "react";
import Sidebar from "@/components/blocks/Sidebar";
import TopNavBar from "@/components/blocks/TopNavBar";

type Props = {
  children: ReactNode;
};

const LayoutTemplate = ({ children }: Props) => {
  return (
    <div className="   flex h-screen  w-screen">
      <TopNavBar />
      <Sidebar />
      <div className="h-full w-[320px] xxxl:w-[410px] " />
      <div className="  h-full w-full ">
        <div className="  flex h-full w-full flex-col">
          <div className=" h-full w-full  px-4 py-4 pt-[120px]">{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LayoutTemplate;
