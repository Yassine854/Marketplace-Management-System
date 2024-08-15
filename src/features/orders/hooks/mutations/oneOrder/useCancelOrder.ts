import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";
import { useGetOrder } from "../../queries/useGetOrder";
import { useOrdersData } from "../../queries/useOrdersData";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useOrderActionsStore } from "@/features/orders/stores/orderActionsStore";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";
import { useGetOrdersCount } from "../../queries/useGetOrdersCount";
import { useAuth } from "@/features/shared/hooks/useAuth";
export const useCancelOrder = () => {
  const { refetch } = useOrdersData();

  const { isNoEditUser } = useGlobalStore();

  const { orderOnReviewId } = useOrderDetailsStore();

  const { refetch: refetchCount } = useGetOrdersCount();

  const { refetch: refetchOrder } = useGetOrder(orderOnReviewId);

  const { setOrderToCancelId, setOrderUnderActionId } = useOrderActionsStore();
  const { user } = useAuth();
  const { mutate, isPending, mutateAsync, isError } = useMutation({
    mutationFn: async (orderId: any) => {
      if (isNoEditUser) {
        toast.error(`Action not allowed`, { duration: 5000 });
        throw new Error();
      }
      //@ts-ignore

      await axios.servicesClient.post("/api/orders/cancelOrder", {
        orderId,
        username: user?.username,
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
