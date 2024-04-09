import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopNavBar />
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;
