import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const generatePickLists = async (
  ordersIdsString: string,
): Promise<string> => {
  try {
    const res = await axios.magentoClient.get(
      `orders/picklist?ordersIds=${ordersIdsString}`,
    );
    return res?.data;
  } catch (error) {
    logError(error);
    throw error;
  }
};
