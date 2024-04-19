import { Order } from "@/types/order";
import { typesenseClient } from "@/libs/typesenseClient";

export type GetOrdersParams = {
  status: string;
  page: number;
  perPage: number;
};

const transformResponse = (res: any): Order[] => {
  return res.hits.map((element: any) => {
    const {
      entity_id,
      customer_firstname,
      customer_lastname,
      customer_id,
      subtotal,
      extension_attributes,
    } = element.document;

    const customerName = `${customer_firstname} ${customer_lastname}`;
    return {
      id: entity_id,
      customer: { name: customerName, id: customer_id },
      total: subtotal,
      deliveryDate: extension_attributes.delivery_date,
    };
  });
};

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
    const res = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParameters);

    const orders: Order[] = transformResponse(res);

    return { orders, total: res.found };
  } catch (error) {}
};
