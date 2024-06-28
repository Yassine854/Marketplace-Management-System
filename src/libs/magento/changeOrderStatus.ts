import { axios } from "@/libs/axios";

export const changeOrderStatus = async (
  orderId: string,
  status: string,
  state: string,
): Promise<any> => {
  try {
    const data = {
      entity: {
        entity_id: orderId,
        status,
        state,
      },
    };
    await axios.magentoClient.post("orders/create", data);
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error fetching data:", error);
    throw error;
  }
};
