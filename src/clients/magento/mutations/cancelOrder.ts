import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const cancelOrder = async (orderId: string): Promise<any> => {
  try {
    const res = await axios.magentoClient.put(`order/cancel/${orderId}`);

    return res?.data;
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
