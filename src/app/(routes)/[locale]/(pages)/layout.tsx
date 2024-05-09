import { ReactNode } from "react";
import Sidebar from "@/components/blocks/Sidebar";
import TopNavBar from "@/components/blocks/TopNavBar";
import { useAuth } from "@/hooks/useAuth";
type Props = {
  children?: ReactNode;
};

const PagesLayout = async ({ children }: Props) => {
  const { getSession } = useAuth();
  const session = await getSession();
  //@ts-ignore
  const isAdmin = session?.user?.role === "ADMIN";
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
