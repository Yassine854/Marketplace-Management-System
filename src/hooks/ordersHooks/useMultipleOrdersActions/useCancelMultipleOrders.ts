import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
//import { magento } from "@/libs/magento";
import { axios } from "@/libs/axios";

export const useCancelMultipleOrders = () => {
  const { mutate, isPending, mutateAsync } = useMutation({
    mutationFn: async (ordersIds: string[]) => {
      return Promise.all(
        ordersIds.map(async (orderId) => {
          return await axios.servicesClient.put(
            "/api/orders/typesense/edit-order",
            {
              order: {
                id: orderId,
                status: "failed",
                state: "canceled",
              },
            },
          );
        }),
      );
    },
    onSuccess: () => {
      toast.success(`Order Canceled Updated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { cancelOrders: mutate, cancelOrdersAsync: mutateAsync, isPending };
};
