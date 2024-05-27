import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaLongRunningClient = new PrismaClient();

const prismaEdgeClient = new PrismaClient().$extends(withAccelerate());

export const prismaClient = process.env.IS_EDGE
  ? prismaLongRunningClient
  : prismaEdgeClient;
