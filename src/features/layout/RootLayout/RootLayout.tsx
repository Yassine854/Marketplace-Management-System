import { Toaster } from "react-hot-toast";
import AuthWrapper from "@/libs/next-auth/authWrapper";
import TanstackQueryProvider from "@/libs/tanstackQuery/TanstackQueryProvider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthWrapper>
      <TanstackQueryProvider>
        <Toaster />
        {children}
      </TanstackQueryProvider>
    </AuthWrapper>
  );
};

export default RootLayout;
