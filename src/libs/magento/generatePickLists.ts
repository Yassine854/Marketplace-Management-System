import { axios } from "@/libs/axios";

export const generatePickLists = async (
  ordersIdsString: string,
): Promise<string> => {
  try {
    const res = await axios.magentoClient.get(
      `orders/picklist?ordersIds=${ordersIdsString}`,
    );
    return res?.data;
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error generating Pick List :", error);
    throw error;
  }
};
