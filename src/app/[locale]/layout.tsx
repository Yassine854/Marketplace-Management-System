"use client";

import { ApolloProviderWrapper } from "@/libs/apollo-provider-wrapper";
import AuthWrapper from "@/libs/authWrapper";
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
