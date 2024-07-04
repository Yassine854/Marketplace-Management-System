import { axios } from "@/libs/axios";

export const cancelOrder = async (orderId: string): Promise<string> => {
  try {
    // const data = {
    //   entity: {
    //     entity_id: orderId,
    //     status: "failed",
    //     state: "canceled",
    //   },
    // };

    const res = await axios.magentoClient.put(`order/cancel/${orderId}`);
    return res?.data;
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error Canceling the :", error);
    throw error;
  }
};
