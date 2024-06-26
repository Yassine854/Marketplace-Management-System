import { axiosClient } from "@/libs/axios/axiosClient";

export const generatePickList = async (
  ordersIdsString: string,
): Promise<string> => {
  try {
    const res = await axiosClient.get(
      `orders/picklist?ordersIds=${ordersIdsString}`,
    );
    return res?.data;
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error generating Pick List :", error);
    throw error;
  }
};
