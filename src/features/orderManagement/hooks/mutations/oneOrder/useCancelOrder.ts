import { useMutation } from "@tanstack/react-query";
import { magento } from "@/clients/magento";
import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useOrdersData } from "../../queries/useOrdersData";
import { useOrdersCount } from "../../queries/useOrdersCount";
import { useGetOrder } from "../../queries/useGetOrder";

export const useCancelOrder = () => {
  const { refetch } = useOrdersData();
  const { refetch: refetchOrder } = useGetOrder();
  const { refetch: refetchCount } = useOrdersCount();

  const { mutate, isPending, mutateAsync, isError } = useMutation({
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
    onSuccess: () => {
      refetch();
      refetchCount();
      refetchOrder();
      toast.success(`Order Canceled  Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return {
    cancelOrder: mutate,
    cancelOrderAsync: mutateAsync,
    isPending,
    isError,
  };
};
