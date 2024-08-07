import { Order } from "@/types/order";
import { logError } from "@/utils/logError";
import { typesense } from "@/clients/typesense";
import { GetManyOrdersParams } from "./getManyOrders.types";

export const getManyOrders = async ({
  sortBy,
  page,
  perPage,
  search,
  filterBy,
}: GetManyOrdersParams): Promise<
  { orders: Order[]; totalOrders: number } | undefined
> => {
  try {
    const res = await typesense.orders.getMany({
      sortBy,
      page,
      perPage,
      search,
      filterBy,
    });

    return res;
  } catch (error) {
    logError(error);
  }
};
