import { axios } from "@/libs/axios";
import { unixTimestampToMagentoDate } from "@/utils/unixTimestamp";

export const getMilkRunOrdersPerDate = async (date: number) => {
  try {
    const response = await axios.magentoClient.get(
      `/orders/list/per_delivery_date?deliveryDate=${unixTimestampToMagentoDate(
        date,
      )}`,
    );
    return {
      orders: response.data,
    };
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error fetching data:", error);
    throw error;
  }
};
