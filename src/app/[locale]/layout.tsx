"use client";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import AuthWrapper from "@/libs/next-auth/authWrapper";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { ApolloProviderWrapper } from "@/libs/apollo/apollo-provider-wrapper";
import TanstackQueryProvider from "@/libs/tanstackQuery/TanstackQueryProvider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const { setIsInEditMode, setSelectedAction } = useOrderDetailsStore();
  useEffect(() => {
    if (pathname !== "/en/order-details") {
      setIsInEditMode(false);
      console.log("test");
      setSelectedAction(null);
    }
  }, [pathname, setIsInEditMode, setSelectedAction]);

  return (
    <AuthWrapper>
      <ApolloProviderWrapper>
        <TanstackQueryProvider>
          <Toaster />
          {children}
        </TanstackQueryProvider>
      </ApolloProviderWrapper>
    </AuthWrapper>
  );
};

export default RootLayout;
