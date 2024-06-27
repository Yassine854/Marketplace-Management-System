import { cancelOrder } from "@/libs/magento/cancelOrder";
import { axiosServicesClient } from "@/libs/axios/axiosServicesClient";

export const onCancelOrderClick = async (orderId: string, refetch: any) => {
  try {
    await cancelOrder(orderId);
    await axiosServicesClient.put("/api/orders/typesense/edit-order", {
      order: {
        id: orderId,
        status: "failed",
        state: "canceled",
      },
    });
    refetch();
  } catch (error) {
    console.error("🚀 ~ onCancelOrderClick ~ error:", error);
  }
};
