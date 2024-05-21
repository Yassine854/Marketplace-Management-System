import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { resolvers } from "@/services/bff/resolvers";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/services/bff/typeDefs";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };
