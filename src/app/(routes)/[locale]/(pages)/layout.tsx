"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/widgets/Sidebar";
import TopNavBar from "@/components/widgets/TopNavBar";

type Props = {
  children?: ReactNode;
};

const PagesLayout = ({ children }: Props) => {
  const isAdmin = true;
  return (
    <div className="h-screen w-screen bg-n10 ">
      <TopNavBar />
      <Sidebar isAdmin={isAdmin} />
      <div className="fixed bottom-0 left-64 right-0  top-16 z-10  rounded-xl bg-n30 p-1.5">
        {children}
      </div>
    </div>
  );
};

export default PagesLayout;
