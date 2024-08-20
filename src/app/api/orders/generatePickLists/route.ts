import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
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
    logError(error);
    return responses.internalServerError(error);
  }
};
