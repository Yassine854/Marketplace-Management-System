import { useMutation } from "@tanstack/react-query";
import { magento } from "@/clients/magento";
import { axios } from "@/libs/axios";

export const useCancelOrder = () => {
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async (orderId: string) => {
      await magento.cancelOrder(orderId);
      await axios.servicesClient.put("/api/orders/typesense/edit-order", {
        order: {
          id: orderId,
          status: "failed",
          state: "canceled",
        },
      });
    },
  });

  return { cancelOrder: mutate, isPending, isSuccess, isError };
};
