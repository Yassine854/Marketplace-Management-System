import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../services/auth";
import { createLog } from "../../../../clients/prisma/getLogs";

export const POST = async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const User = session.user as {
    id: string;
    roleId: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
  try {
    const { ordersIds } = await request.json();
    if (!ordersIds) {
      return responses.invalidRequest("ordersIds is Required");
    }

    const url = await magento.mutations.generatePickLists(ordersIds);

    return NextResponse.json(
      { message: "Orders Pick Lists Generated Successfully", url },
      { status: 200 },
    );
  } catch (error: any) {
    await createLog({
      type: "error",
      message: error.message || "Internal Server Error",
      context: {
        userId: User.id,
        username: User.username,
      },
      timestamp: new Date(),
      dataBefore: {},
      dataAfter: "error",
      id: "",
    });
    logError(error);
    return responses.internalServerError(error);
  }
};
