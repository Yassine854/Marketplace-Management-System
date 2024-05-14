import { Order } from "@/types/order";
import { typesenseClient } from "@/libs/typesenseClient";

export type GetOrdersParams = {
  status: string;
  page: number;
  perPage: number;
  sortBy: string;
  search: string;
};

const unixTimestampToDate = (timestamp: number) => {
  // Create a new Date object using the provided timestamp
  const dateObject = new Date(timestamp);

  // Extract day, month, and year components from the Date object
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are 0-indexed
  const year = dateObject.getFullYear();

  // Return the date string in the format "DD/MM/YYYY"
  return `${day}/${month}/${year}`;
};

const createOrdersList = (typesenseHits: any): Order[] =>
  typesenseHits.map(({ document }: any): Order => {
    console.log("🚀 ~ returntypesenseHits.map ~ document:", document.items);
    return {
      id: document.id,
      customer: {
        id: document.customer_id,
        name: document.customer_firstname + " " + document.customer_lastname,
      },
      total: document.total,
      deliveryDate: unixTimestampToDate(document.delivery_date),
      isSelected: false,
      lines: [],
    };
  });

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
      query_by: "customer_firstname,customer_lastname",
      page: page,
      per_page: perPage,
      sort_by: sortBy,
      filter_by: "created_at:[1702531200000..1735104000000]",
    };

    if (status) {
      const filter = {
        filter_by:
          "status:= " + status + " && created_at:[16531200000..1675104000000]",
      };

      searchParams = Object.assign(
        searchParamsWithoutFilter,
        "created_at:[1672531200000..1675104000000]",
      );
    } else {
      searchParams = searchParamsWithoutFilter;
    }

    const typesenseResponse = await typesenseClient
      .collections("orders2")
      .documents()
      .search(searchParamsWithoutFilter);

    const orders: Order[] = createOrdersList(typesenseResponse?.hits);

    return {
      orders,
      totalOrders: typesenseResponse.found,
    };
  } catch (error) {
    console.error(error);
  }
};
