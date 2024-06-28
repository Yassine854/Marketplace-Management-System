import { cancelOrder } from "@/libs/magento/cancelOrder";
import { axios } from "@/libs/axios";

export const onCancelMultipleOrdersClick = async (
  orderIdsList: string[],
  refetch: any,
) => {
  try {
    await Promise.all(
      orderIdsList.map(async (id) => {
        await cancelOrder(id);
        await axios.servicesClient.put("/api/orders/typesense/edit-order", {
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
