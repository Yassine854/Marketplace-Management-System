import { axiosMagentoClient } from "@/libs/axios/axiosMagentoClient";

export const generateOrderSummary = async (
  orderId: string,
): Promise<string> => {
  try {
    const data = JSON.stringify({
      orderId: orderId,
    });

    const res = await axiosMagentoClient.post("order_summary/generate", data);
    return res?.data;
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error generating Order Summary :", error);
    throw error;
  }
};
