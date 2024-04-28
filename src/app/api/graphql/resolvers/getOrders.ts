import { Order } from "@/types/order";
import { typesenseClient } from "@/libs/typesenseClient";
import { useSearchParams } from "next/navigation";

export type GetOrdersParams = {
  status: string;
  page: number;
  perPage: number;
  sortBy: string;
  search: string;
};

const createOrdersList = (typesenseHits: any): Order[] =>
  typesenseHits.map(
    ({ document }: any): Order => ({
      id: document.extension_attributes.kamioun_order_id,
      customer: {
        id: document.customer_id,
        name: document.customer_firstname + " " + document.customer_lastname,
      },
      total: document.subtotal,
      deliveryDate: document.extension_attributes.delivery_date,
      isSelected: false,
    }),
  );

export const getOrders = async ({
  status,
  sortBy,
  page,
  perPage,
  search,
}: GetOrdersParams): Promise<
  { orders: Order[]; totalOrders: number } | undefined
> => {
  try {
    let searchParams;
    const searchParamsWithoutFilter = {
      q: search,
      query_by: "customer_firstname",
      page: page,
      per_page: perPage,
      sort_by: sortBy,
    };

    if (status) {
      const filter = {
        filter_by: "status:= " + status,
      };
      searchParams = Object.assign(searchParamsWithoutFilter, filter);
    } else {
      searchParams = searchParamsWithoutFilter;
    }

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
    console.error(error);
  }
};
