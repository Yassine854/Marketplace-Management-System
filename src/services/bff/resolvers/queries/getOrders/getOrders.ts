import { GetOrdersParams } from "./getOrders.types";
import { Order } from "@/types/order";
import { typesense } from "@/clients/typesense";

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
    const { orders, count } = await typesense.orders.getMany({
      sortBy,
      page,
      perPage,
      search,
      filterBy,
    });

    return {
      orders,
      totalOrders: count,
    };
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("getOrders resolver Error ", error);
  }
};
