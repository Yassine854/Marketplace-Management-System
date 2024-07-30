import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const generateOrderSummary = async (
  orderId: string,
): Promise<string> => {
  try {
    const data = JSON.stringify({
      orderId: orderId,
    });

    const res = await axios.magentoClient.post("order_summary/generate", data);
    return res?.data;
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
