import { Order } from "@/types/order";
import { getOrderItems } from "../getOrderItems";
import { getOrderSource } from "../getOrderSource";

const deliveryDateToUnixTimeStamp = (
  deliveryDate: string,
): number | undefined => {
  if (!deliveryDate) {
    return undefined;
  }

  const date = new Date(deliveryDate);
  const unixTimestampToDate = Math.floor(date.getTime() / 1000);
  return unixTimestampToDate;
};

export const getOrdersBatch = (orders: any): Order[] =>
  orders?.map((order: any) => {
    return {
      id: String(order?.entity_id) || "",
      orderId: String(order?.entity_id) || "",
      incrementId: String(order?.increment_id) || "",
      kamiounId: String(order?.extension_attributes?.kamioun_order_id) || "",
      storeId: String(order?.store_id),
      state: String(order?.state) || "",
      status: String(order?.status) || "",
      total: Number(order?.subtotal) || 0,
      createdAt: new Date(order?.created_at).getTime() || 0,
      customerId: String(order?.customer_id) || "",
      customerFirstname: String(order?.customer_firstname) || "",
      customerLastname: String(order?.customer_lastname) || "",
      customerPhone: String(order?.billing_address?.telephone) || "",
      deliveryAgentId:
        String(order?.extension_attributes?.delivery_agent_id) || "",
      deliveryAgentName:
        String(order?.extension_attributes?.delivery_agent) || "",
      deliveryStatus:
        String(order?.extension_attributes?.delivery_status) || "",
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
