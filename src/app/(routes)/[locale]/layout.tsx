"use client";

import { ApolloProviderWrapper } from "@/libs/apollo-provider-wrapper";

// import NextAuthSessionProvider from "@/libs/SessionProvider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <NextAuthSessionProvider> */}
      <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      {/* </NextAuthSessionProvider> */}
    </>
  );
};

export default RootLayout;
