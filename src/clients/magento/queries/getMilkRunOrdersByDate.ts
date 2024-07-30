import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { unixTimestampToMagentoDate } from "@/utils/unixTimestamp";

export const getMilkRunOrdersByDate = async (date: number): Promise<any[]> => {
  try {
    const magnetoDate = unixTimestampToMagentoDate(date);

    const response = await axios.magentoClient.get(
      `/orders/list/per_delivery_date?deliveryDate=${magnetoDate}`,
    );

    return response?.data || [];
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
