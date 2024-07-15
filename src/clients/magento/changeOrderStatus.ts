import { axios } from "@/libs/axios";

export const changeOrderStatus = async ({
  orderId,
  status,
  state,
}: any): Promise<any> => {
  try {
    const data = {
      entity: {
        entity_id: orderId,
        status,
        state,
      },
    };
    await axios.magentoClient.put("orders/create", data);
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error changing order status:", error);
    throw error;
  }
};
