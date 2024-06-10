"use client";

import { ApolloProviderWrapper } from "@/libs/apollo/apollo-provider-wrapper";
import AuthWrapper from "@/libs/next-auth/authWrapper";
import { Toaster } from "react-hot-toast";
import TanstackQueryProvider from "@/libs/tanstackQuery/TanstackQueryProvider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
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
