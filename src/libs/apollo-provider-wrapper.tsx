import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { ReactNode, useMemo } from "react";

import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
});

export const ApolloProviderWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const client = useMemo(() => {
    const authMiddleware = setContext(async (operation, { headers }) => {
      //   const { token } = await fetch("/api/auth/token").then((res) =>
      //     res.json(),
      //   );

      return {
        headers: {
          ...headers,
          // authorization: `Bearer ${token}`,
        },
      };
    });

    return new ApolloClient({
      link: from([authMiddleware, httpLink]),
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
