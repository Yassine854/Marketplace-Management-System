import { axios } from "@/libs/axios";

export const editOrderDetails = async ({
  orderId,
  deliveryDate,
  items,
}: any): Promise<any> => {
  try {
    const data = {
      items: items,
      entity: {
        entity_id: orderId,
        extension_attributes: {
          delivery_date: deliveryDate,
        },
      },
    };
    await axios.magentoClient.put("orders/create", data);
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error changing order status:", error);
    throw error;
  }
};
