import TopNavBar from "@/components/TopNavBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopNavBar />
      {children}
    </div>
  );
};

export default Layout;
