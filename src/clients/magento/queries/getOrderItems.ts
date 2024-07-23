import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const getOrderItems = async (orderId: string): Promise<any> => {
  try {
    const response = await axios.magentoClient.get(
      `/products/order?orderId=${orderId}`,
    );

    return response.data;
  } catch (error) {
    logError(error);
    throw error;
  }
};
