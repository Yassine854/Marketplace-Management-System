import { axiosMagentoClient } from "@/libs/axios/axiosMagentoClient";

export const generatePickLists = async (
  ordersIdsString: string,
): Promise<string> => {
  try {
    const res = await axiosMagentoClient.get(
      `orders/picklist?ordersIds=${ordersIdsString}`,
    );
    return res?.data;
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error generating Pick List :", error);
    throw error;
  }
};
