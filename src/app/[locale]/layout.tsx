"use client";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import AuthWrapper from "@/libs/next-auth/authWrapper";
import { ApolloProviderWrapper } from "@/libs/apollo/apollo-provider-wrapper";
import TanstackQueryProvider from "@/libs/tanstackQuery/TanstackQueryProvider";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useUsersStore } from "@/features/usersManagement/stores/usersStore";

//To Refactor
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const { setIsInEditMode } = useOrderDetailsStore();
  const { setUserOnReviewUsername } = useUsersStore();

  useEffect(() => {
    if (pathname !== "/en/order-details") {
      setIsInEditMode(false);
    }
    if (pathname !== "/en/access/edit-user") {
      setUserOnReviewUsername("");
    }
    //NO More Dependencies
  }, [pathname]);

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
