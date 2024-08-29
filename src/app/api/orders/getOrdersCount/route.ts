export const revalidate = 0;

import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { NextResponse, type NextRequest } from "next/server";
import { getManyOrders } from "@/services/orders/getManyOrders/getManyOrders";

export const GET = async (request: NextRequest) => {
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
    logError(error);

    return responses.internalServerError();
  }
};
