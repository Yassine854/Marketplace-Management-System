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

    if (!sortBy) {
      return responses.invalidRequest("sortBy parameter is Required");
    }

    if (!search) {
      return responses.invalidRequest("search parameter is Required");
    }

    if (!perPage) {
      return responses.invalidRequest("perPage parameter is Required");
    }

    if (!filterBy) {
      return responses.invalidRequest("filterBy parameter is Required");
    }

    const orders = await getManyOrders({
      page,
      sortBy,
      search,
      perPage,
      filterBy,
    });

    return NextResponse.json(
      {
        message: "success",
        orders,
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
