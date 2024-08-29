export const revalidate = 0;

import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { NextResponse, type NextRequest } from "next/server";
import { getAllDeliveryAgents } from "@/services/delivery/getAllDeliveryAgents";

export const GET = async (request: NextRequest) => {
  try {
    const deliveryAgents = await getAllDeliveryAgents();
    return NextResponse.json(
      {
        message: "success",
        deliveryAgents,
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
