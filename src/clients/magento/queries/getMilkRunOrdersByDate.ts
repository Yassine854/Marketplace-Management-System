import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { formatIsoDate2MagentoDate } from "@/utils/date/convertIsoDate2MagentoDate";

export const getMilkRunOrdersByDate = async (date: string): Promise<any[]> => {
  try {
    const magnetoDate = formatIsoDate2MagentoDate(date);

    const response = await axios.magentoClient.get(
      `/orders/list/per_delivery_date?deliveryDate=${magnetoDate}`,
    );

    return response?.data || [];
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
