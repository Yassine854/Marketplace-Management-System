import { GetOrdersParams } from "./getOrders.types";
import { Order } from "@/types/order";
import { typesenseClient } from "@/libs/typesenseClient";
import { unixTimestampToDate } from "@/utils/unixTimestampToDate";

const createOrdersList = (typesenseHits: any): Order[] =>
  typesenseHits.map(({ document }: any): Order => {
    return {
      id: document.id,
      customer: {
        id: document.customer_id,
        name: document.customer_firstname + " " + document.customer_lastname,
      },
      total: document.total,
      deliveryDate: unixTimestampToDate(document.delivery_date),
    };
  });

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
      query_by: "customer_firstname,customer_lastname",
      page: page,
      per_page: perPage,
      sort_by: sortBy,
      filter_by: filterBy,
    };

    // let searchParams;

    // const searchParamsWithoutFilter = {
    //   q: search,
    //   query_by: "customer_firstname,customer_lastname",
    //   page: page,
    //   per_page: perPage,
    //   sort_by: sortBy,
    //   filter_by: "created_at:[1702531200000..1735104000000]",
    // };

    // if (status) {
    //   const filter = {
    //     filter_by:
    //       "status:= " + status + " && created_at:[16531200000..1675104000000]",
    //   };

    //   searchParams = Object.assign(
    //     searchParamsWithoutFilter,
    //     "created_at:[1672531200000..1675104000000]",
    //   );
    // } else {
    //   searchParams = searchParamsWithoutFilter;
    // }

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
