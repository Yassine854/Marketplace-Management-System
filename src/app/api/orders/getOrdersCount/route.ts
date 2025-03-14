export const revalidate = 0;

import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { NextResponse, type NextRequest } from "next/server";
import { getManyOrders } from "@/services/orders/getManyOrders/getManyOrders";
import { auth } from "../../../../services/auth";
import { createLog } from "../../../../clients/prisma/getLogs";

export const GET = async (request: NextRequest) => {
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
    const { searchParams } = new URL(request.url);

    const storeId = searchParams.get("storeId");

    //@ts-ignore
    const openOrders = await getManyOrders({
      page: 1,
      perPage: 1,
      filterBy: storeId ? `status:=open&&storeId:=${storeId}` : "status:open",
    });

    //@ts-ignore
    const validOrders = await getManyOrders({
      page: 1,
      perPage: 1,
      filterBy: storeId ? `status:=valid&&storeId:=${storeId}` : "status:valid",
    });

    //@ts-ignore
    const shippedOrders = await getManyOrders({
      page: 1,
      perPage: 1,
      filterBy: storeId
        ? `status:=shipped&&storeId:=${storeId}`
        : "status:shipped",
    });

    return NextResponse.json(
      {
        message: "success",
        //@ts-ignore
        openOrdersCount: openOrders?.count,
        //@ts-ignore
        validOrdersCount: validOrders?.count,
        //@ts-ignore
        shippedOrdersCount: shippedOrders.count,
      },
      {
        status: 200,
      },
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

    return responses.internalServerError();
  }
};
