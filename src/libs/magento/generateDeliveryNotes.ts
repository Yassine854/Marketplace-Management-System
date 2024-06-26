import { axiosClient } from "@/libs/axios/axiosClient";

export const generateDeliveryNotes = async (
  ordersIdsString: string,
): Promise<string> => {
  try {
    const data = JSON.stringify({
      ordersIds: ordersIdsString,
    });

    const res = await axiosClient.post("order_summary/bulk_zip_generate", data);
    return res?.data;
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error generating Delivery Notes :", error);
    throw error;
  }
};
