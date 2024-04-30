import { Order } from "@/types/order";
import { OrderLine } from "@/types/OrderLine";
import { typesenseClient } from "@/libs/typesenseClient";

const formatOrder = (typesenseHits: any): Order => {
  const document = typesenseHits[0].document;

  const lines: OrderLine[] = document.items.map((e: any) => ({
    id: e.item_id,
    sku: e.sku,
    orderId: e.order_id,
    productId: e.product_id,
    productName: e.name,
    quantity: e.qty_ordered,
    productPrice: e.price,
    totalPrice: e.price * e.qty_ordered,
  }));

  return {
    id: document.extension_attributes?.kamioun_order_id,
    total: document.subtotal,
    deliveryDate: document.extension_attributes?.delivery_date,
    isSelected: false,
    lines: lines,
    customer: {
      id: document.customer_id,
      name: document.customer_firstname + " " + document.customer_lastname,
    },
  };
};

export const getOrder = async (
  id: string,
): Promise<{ id: string } | undefined> => {
  try {
    const searchParams = {
      filter_by: "customer_firstname:=brahmi",
      q: "brahmi",
      query_by: "customer_firstname",
    };

    const typesenseResponse = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);

    const order: Order = formatOrder(typesenseResponse?.hits);

    return order;
  } catch (error) {
    console.error(error);
  }
};
