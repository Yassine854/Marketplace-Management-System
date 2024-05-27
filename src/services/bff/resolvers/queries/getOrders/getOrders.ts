import { GetOrdersParams } from "./getOrders.types";
import { Order } from "@/types/order";
import { typesenseClient } from "@/libs/typesense";

const createOrdersList = (typesenseHits: any): Order[] =>
  typesenseHits.map(({ document }: any): Order => document);

export const getOrders = async ({
  sortBy,
  page,
  perPage,
  search,
  filterBy,
}: GetOrdersParams): Promise<
  { orders: Order[]; totalOrders: number } | undefined
> => {
  try {
    const searchParams = {
      q: search,
      query_by: "customerFirstname,customerLastname,kamiounId",
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
      totalOrders: typesenseResponse.found,
    };
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("getOrders resolver Error ", error);
  }
};
