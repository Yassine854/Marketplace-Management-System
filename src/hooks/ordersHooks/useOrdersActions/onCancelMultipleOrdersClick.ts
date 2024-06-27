import { cancelOrder } from "@/libs/magento/cancelOrder";
import { axiosServicesClient } from "@/libs/axios/axiosServicesClient";

export const onCancelMultipleOrdersClick = async (
  orderIdsList: string[],
  refetch: any,
) => {
  try {
    await Promise.all(
      orderIdsList.map(async (id) => {
        await cancelOrder(id);
        await axiosServicesClient.put("/api/orders/typesense/edit-order", {
          order: {
            id: id,
            status: "failed",
            state: "canceled",
          },
        });
      }),
    );

    refetch();
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};
