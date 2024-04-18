import { Params, getOrders } from "./getOrders";

import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";

export const useGetOrders = (params: Params) => {
  return useQuery<{ orders: Order[]; total: number } | undefined, Error>({
    queryKey: ["orders"],
    queryFn: () => getOrders(params),
  });
};
