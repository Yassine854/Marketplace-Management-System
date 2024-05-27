import { Order } from "@/types/order";
import { typesenseClient } from "@/libs/typesense";

export const getOrder = async (
  orderId: string,
): Promise<{ id: string } | undefined> => {
  try {
    const searchParams = {
      filter_by: "id:=" + orderId,
      q: "",
      query_by: "kamiounId",
    };

    const typesenseResponse = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);

    const hits = typesenseResponse?.hits || [];
    const order: Order = hits[0]?.document as Order;

    return order;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.error(error);
  }
};
