import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { NextResponse, type NextRequest } from "next/server";
import { getManyOrders } from "@/services/orders/getManyOrders/getManyOrders";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const sortBy = searchParams.get("sortBy");

    const search = searchParams.get("search");

    const page = Number(searchParams.get("page"));

    const filterBy = searchParams.get("filterBy");

    const perPage = Number(searchParams.get("perPage"));

    if (!page) {
      return responses.invalidRequest("page parameter is Required");
    }

    if (!perPage) {
      return responses.invalidRequest("perPage parameter is Required");
    }

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
    logError(error);

    return responses.internalServerError();
  }
};
