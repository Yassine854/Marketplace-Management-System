import { Order } from "@/types/order";
import { typesenseClient } from "../typesenseClient";

export const getManyOrders = async ({
  sortBy,
  page,
  perPage,
  search,
  filterBy,
}: any): Promise<any> => {
  try {
    const searchParams = {
      q: search,
      query_by: "customerFirstname,customerLastname,kamiounId,orderId",
      page: page,
      per_page: perPage,
      sort_by: sortBy,
      filter_by: filterBy,
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
    process.env.NODE_ENV === "development" &&
      console.error("getOrders resolver Error ", error);
  }
};

const createOrdersList = (typesenseHits: any): Order[] =>
  typesenseHits.map(({ document }: any): Order => document);
