import { Order } from "@/types/order";
import { typesenseClient } from "../typesenseClient";
import { logError } from "@/utils/logError";

export const getManyOrders = async ({
  sortBy,
  page,
  perPage,
  search,
  filterBy,
}: any): Promise<any> => {
  try {
    const searchParams = {
      q: search || "",
      query_by:
        "customerFirstname,customerLastname,kamiounId,orderId,incrementId",
      page: page || 1,
      per_page: perPage || 250,
      sort_by: sortBy || "",
      filter_by: filterBy || "",
    };

    const typesenseResponse = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);

    const orders: Order[] = createOrdersList(typesenseResponse?.hits);

    return {
      orders,
      count: typesenseResponse.found,
    };
  } catch (error) {
    logError(error);
  }
};

const createOrdersList = (typesenseHits: any): Order[] =>
  typesenseHits.map(({ document }: any): Order => document);
