import { typesenseClient } from "@/libs/typesenseClient";

export const indexingOrders = async (
  data: any,
  encoding: any,
  callback: any,
) => {
  try {
    const orders = JSON.parse(data);

    const ordersBatch = orders.map((order: any) => {
      return {
        id: String(order.extension_attributes.kamioun_order_id) || "",
        status: order.status || "",
        total: order.subtotal || 0,
        created_at: new Date(order.created_at).getTime() || 0,
        customer_id: String(order.customer_id) || "",
        customer_firstname: order.customer_firstname || "",
        customer_lastname: order.customer_lastname || "",
        delivery_agent_id:
          String(order.extension_attributes.delivery_agent_id) || "",
        delivery_agent: order.extension_attributes.delivery_agent || "",
        delivery_date:
          new Date(order.extension_attributes.delivery_date).getTime() || 0,
        verified: !!order.extension_attributes.verified || false,
        from_mobile: !!order.extension_attributes.from_mobile || false,
        items: order.items || [],
      };
    });

    await typesenseClient
      .collections("orders")
      .documents()
      .import(ordersBatch, { action: "upsert" });

    callback();
  } catch (err) {
    console.error(err);
    callback(err);
  }
};
