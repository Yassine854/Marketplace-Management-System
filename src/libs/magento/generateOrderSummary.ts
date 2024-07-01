import { axios } from "@/libs/axios";

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
    process.env.NODE_ENV === "development" &&
      console.error("Error generating Order Summary :", error);
    throw error;
  }
};
