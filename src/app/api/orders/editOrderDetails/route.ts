import { createUser } from "@/services/users/createUser";
import { NextRequest, NextResponse } from "next/server";
import { axios } from "@/libs/axios";
import { magento } from "@/clients/magento";
import { getOrderProductsNames } from "@/services/typesense/getOrderProductsNames";
import { typesense } from "@/clients/typesense";
//import { formatIsoDate2MagentoDate } from "@/utils/date/convertIsoDate2MagentoDate";

export const POST = async (request: NextRequest) => {
  try {
    const { orderDetails } = await request.json();

    const { total, orderId, items, deliveryDate } = orderDetails;

    await magento.mutations.editOrderDetails({
      total,
      items,
      orderId,
      deliveryDate,
    });

    await typesense.orders.updateOne({
      total,
      items,
      orderId,
      deliveryDate,
    });

    return NextResponse.json(
      {
        message: "Order Edited  Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
};
