import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const generateMultipleOrdersDeliveryNotes = async (
  ordersIdsString: string,
): Promise<string> => {
  try {
    const data = JSON.stringify({
      ordersIds: ordersIdsString,
    });

    const res = await axios.magentoClient.post(
      "order_summary/bulk_zip_generate",
      data,
    );
    return res?.data;
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
