"use client";

import { ApolloProviderWrapper } from "@/libs/apollo/apollo-provider-wrapper";
import AuthWrapper from "@/libs/next-auth/authWrapper";
import { Toaster } from "react-hot-toast";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthWrapper>
      <ApolloProviderWrapper>
        <Toaster />
        {children}
      </ApolloProviderWrapper>
    </AuthWrapper>
  );
};

export default RootLayout;
