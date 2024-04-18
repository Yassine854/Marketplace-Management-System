import { Order } from "@/types/order";
import { transformResponse } from "./transformResponse";
import { typesenseClient } from "@/libs/typesenseClient";

export type Params = {
  status: string;
  page: number;
  perPage: number;
};

export const getOrders = async ({
  status,
  page,
  perPage,
}: Params): Promise<{ orders: Order[]; total: number } | undefined> => {
  try {
    const searchParameters = {
      q: status,
      query_by: "status",
      page: page,
      per_page: perPage,
    };
    const res = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParameters);

    const orders: Order[] = transformResponse(res.hits);

    return { orders, total: res.found };
  } catch (error) {}
};
