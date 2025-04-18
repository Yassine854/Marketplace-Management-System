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

    const sortBy = searchParams.get("sortBy");

    const search = searchParams.get("search");

    const page = Number(searchParams.get("page"));

    const storeId = searchParams.get("storeId");

    const status = searchParams.get("status");

    const perPage = Number(searchParams.get("perPage"));

    if (!page) {
      return responses.invalidRequest("page parameter is Required");
    }

    if (!perPage) {
      return responses.invalidRequest("perPage parameter is Required");
    }
    let filterBy = "";

    if (status && storeId) {
      filterBy = `status:=${status}&&storeId:=${storeId}`;
    }
    if (status && !storeId) {
      filterBy = `status:=${status}`;
    }
    if (!status && storeId) {
      filterBy = `storeId:=${storeId}`;
    }
    const filterB = searchParams.get("filterBY"); // The filter string passed from the client
    //
    if (filterB != null) filterBy = filterB;
    //
    const filters = searchParams.get("filters");
    //
    if (filters !== "") filterBy = filterBy + " && " + filters;
    const query = filterBy.replace(/, /g, " && ");

    //
    //@ts-ignore
    const res = await getManyOrders({
      page,
      perPage,
      sortBy: sortBy || "",
      search: search || "",
      filterBy: filterBy || "",
    });

    return NextResponse.json(
      {
        message: "success",
        orders: res?.orders,
        //@ts-ignore
        count: res?.count,
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
