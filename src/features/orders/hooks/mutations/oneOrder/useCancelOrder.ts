import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";
import { useGetOrder } from "../../queries/useGetOrder";
import { useOrdersData } from "../../queries/useOrdersData";
import { useOrdersCount } from "../../queries/useOrdersCount";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useOrderActionsStore } from "@/features/orders/stores/orderActionsStore";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";

export const useCancelOrder = () => {
  const { refetch } = useOrdersData();

  const { isNoEditUser } = useGlobalStore();

  const { orderOnReviewId } = useOrderDetailsStore();

  const { refetch: refetchCount } = useOrdersCount();

  const { refetch: refetchOrder } = useGetOrder(orderOnReviewId);

  const { setOrderToCancelId, setOrderUnderActionId } = useOrderActionsStore();

  const { mutate, isPending, mutateAsync, isError } = useMutation({
    mutationFn: async (orderId: string) => {
      if (isNoEditUser) {
        toast.error(`Action not allowed`, { duration: 5000 });
        throw new Error();
      }
      await magento.mutations.cancelOrder(orderId);
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
      setOrderToCancelId("");
      setOrderUnderActionId("");
      toast.success(`Order Canceled  Successfully`, { duration: 5000 });
    },
    onError: () => {
      setOrderToCancelId("");
      setOrderUnderActionId("");

      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return {
    isError,
    isPending,
    cancelOrder: mutate,
    cancelOrderAsync: mutateAsync,
  };
};
