import { magento } from "@/libs/magento";
import { axios } from "@/libs/axios";

export const onCancelOrderClick = async (orderId: string, refetch: any) => {
  try {
    await magento.cancelOrder(orderId);
    await axios.servicesClient.put("/api/orders/typesense/edit-order", {
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
