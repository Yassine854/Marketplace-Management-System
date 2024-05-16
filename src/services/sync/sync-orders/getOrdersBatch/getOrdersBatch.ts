import { Order } from "@/types/order";
import { getOrderLines } from "../getOrderLines";
import { getOrderSource } from "../getOrderSource";

export const getOrdersBatch = (orders: any): Order[] =>
  orders?.map((order: any) => {
    return {
      id: String(order?.entity_id) || "",
      kamiounId: String(order?.extension_attributes?.kamioun_order_id) || "",
      state: order?.state || "",
      status: order?.status || "",
      total: order?.subtotal || 0,
      createdAt: new Date(order?.created_at).getTime() || 0,
      customerId: String(order?.customer_id) || "",
      customerFirstname: order?.customer_firstname || "",
      customerLastname: order?.customer_lastname || "",
      deliveryAgentId:
        String(order?.extension_attributes?.delivery_agent_id) || "",
      deliveryAgent: order?.extension_attributes?.delivery_agent || "",
      deliveryDate:
        new Date(order?.extension_attributes?.delivery_date).getTime() || 0,
      source: getOrderSource(
        !!order?.extension_attributes?.from_mobile,
        !!order?.extension_attributes?.verified,
      ),
      lines: getOrderLines(order?.items),
    };
  }) || [];
