import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";
import { NextResponse } from "next/server";

export const cancelOrder = async (
  orderIds: string | string[],
): Promise<any> => {
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
    let orderIdsArray: string[];

    if (typeof orderIds === "string") {
      orderIdsArray = orderIds.split(",").map((id: string) => id.trim());
    } else if (Array.isArray(orderIds)) {
      orderIdsArray = orderIds;
    } else {
      throw new Error(
        "Invalid orderIds format. It should be a string or an array.",
      );
    }

    const orderIdsString = orderIdsArray.join(",");

    //);

    const res = await axios.magentoClient.put(`orders/cancel`, {
      orderIds: orderIdsString,
    });

    return res?.data;
  } catch (error: any) {
    logError(error);

    const errorPayload = {
      orderIds: Array.isArray(orderIds) ? orderIds.join(",") : orderIds,
    };
    const errorMessage = `Error occurred while canceling orders. Payload: ${JSON.stringify(
      errorPayload,
    )}. ${error?.response?.data?.message || "An error occurred."}`;
    await createLog({
      type: "error",
      message: (error as Error).message || "Internal Server Error",
      context: {
        userId: User.id,
        username: User.username,
      },
      timestamp: new Date(),
      dataBefore: {},
      dataAfter: "error",
      id: "",
    });
    throw new Error(errorMessage);
  }
};
