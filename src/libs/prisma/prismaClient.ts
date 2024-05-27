import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

let prismaClient = new PrismaClient();

if (process.env.IS_EDGE) {
  //@ts-ignore
  prismaClient = new PrismaClient().$extends(withAccelerate());
}
export { prismaClient };
