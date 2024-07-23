import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const getOrderDetails = async (orderId: string): Promise<any> => {
  try {
    const response = await axios.magentoClient.get(
      `/products/order?orderId=${orderId}`,
    );
    console.log("🚀 ~ getOrderDetails ~ response:", response);
    return {
      //orderDetails: response.data.items,
    };
  } catch (error) {
    logError(error);
    throw error;
  }
};
