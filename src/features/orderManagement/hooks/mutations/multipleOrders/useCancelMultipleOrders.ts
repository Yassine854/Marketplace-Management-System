import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { axios } from "@/libs/axios";
import { useOrdersCount } from "../../queries/useOrdersCount";
import { useOrdersData } from "../../queries/useOrdersData";

export const useCancelMultipleOrders = () => {
  const { refetch } = useOrdersData();
  const { refetch: refetchCount } = useOrdersCount();
  const { mutate, isPending, mutateAsync } = useMutation({
    mutationFn: async (ordersIds: string[]) => {
      return Promise.all(
        ordersIds.map(async (orderId) => {
          await magento.cancelOrder(orderId);
          await axios.servicesClient.put("/api/orders/typesense/edit-order", {
            order: {
              id: orderId,
              status: "failed",
              state: "canceled",
            },
          });
        }),
      );
    },
    onSuccess: () => {
      refetch();
      refetchCount();
      toast.success(`Orders Canceled  Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { cancelOrders: mutate, cancelOrdersAsync: mutateAsync, isPending };
};
