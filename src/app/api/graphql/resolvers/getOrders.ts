import { Order } from "@/types/order";
import { typesenseClient } from "@/libs/typesenseClient";

export type GetOrdersParams = {
  status: string;
  page: number;
  perPage: number;
};

const createOrdersList = (typesenseHits: any): Order[] =>
  typesenseHits.map(
    ({ document }: any): Order => ({
      id: document.entity_id,
      customer: {
        id: document.customer_id,
        name: document.customer_firstname + " " + document.customer_lastname,
      },
      total: document.subtotal,
      deliveryDate: document.extension_attributes.delivery_date,
    }),
  );

export const getOrders = async ({
  status,
  page,
  perPage,
}: GetOrdersParams): Promise<
  { orders: Order[]; total: number } | undefined
> => {
  try {
    const searchParameters = {
      q: status,
      query_by: "status",
      page: page,
      per_page: perPage,
    };
    const typesenseResponse = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParameters);

    const orders: Order[] = createOrdersList(typesenseResponse?.hits);

    return {
      orders,
      total: typesenseResponse.found,
    };
  } catch (error) {
    console.error("🚀 ~  getOrders error:", error);
  }
};
