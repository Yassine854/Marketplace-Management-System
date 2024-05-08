"use client";

import { ApolloProviderWrapper } from "@/libs/apollo-provider-wrapper";
import { Toaster } from "react-hot-toast";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ApolloProviderWrapper>
        <Toaster />
        {children}
      </ApolloProviderWrapper>
    </>
  );
};

export default RootLayout;
