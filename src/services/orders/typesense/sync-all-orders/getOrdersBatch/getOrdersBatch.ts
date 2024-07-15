import { Order } from "@/types/order";
import { getOrderItems } from "../getOrderItems";
import { getOrderSource } from "../getOrderSource";

const deliveryDateToUnixTimeStamp = (deliveryDate: any) => {
  if (deliveryDate) {
    // Create a new Date object from the date string
    const date = new Date(deliveryDate);

    // Get the Unix timestamp (in seconds)
    return Math.floor(date.getTime() / 1000);
  }

  return undefined;
};

export const getOrdersBatch = (orders: any): Order[] =>
  orders?.map((order: any) => {
    return {
      id: String(order?.entity_id) || "",
      kamiounId: String(order?.extension_attributes?.kamioun_order_id) || "",
      storeId: order?.store_id,
      state: order?.state || "",
      status: order?.status || "",
      total: order?.subtotal || 0,
      createdAt: new Date(order?.created_at).getTime() || 0,
      customerId: String(order?.customer_id) || "",
      customerFirstname: order?.customer_firstname || "",
      customerLastname: order?.customer_lastname || "",
      customerPhone: order?.billing_address?.telephone || "",
      deliveryAgentId:
        String(order?.extension_attributes?.delivery_agent_id) || "",
      deliveryAgentName: order?.extension_attributes?.delivery_agent || "",
      deliveryStatus: order?.extension_attributes?.delivery_status || "",
      deliveryDate: deliveryDateToUnixTimeStamp(
        order?.extension_attributes?.delivery_date,
      ),
      source: getOrderSource(
        !!order?.extension_attributes?.from_mobile,
        !!order?.extension_attributes?.verified,
      ),
      items: getOrderItems(order?.items),
    };
  }) || [];
