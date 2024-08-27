import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useGetOrder } from "../../queries/useGetOrder";
import { useOrdersData } from "../../queries/useOrdersData";
import { useGetOrdersCount } from "../../queries/useGetOrdersCount";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useOrderActionsStore } from "@/features/orders/stores/orderActionsStore";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";
import { useAuth } from "@/features/shared/hooks/useAuth";
export const useChangeOrderStatus = () => {
  const { refetch } = useOrdersData();

  const { isNoEditUser } = useGlobalStore();

  const { orderOnReviewId } = useOrderDetailsStore();

  const { refetch: refetchCount } = useGetOrdersCount();

  const { setOrderUnderActionId } = useOrderActionsStore();

  const { refetch: refetchOrder } = useGetOrder(orderOnReviewId);
  const { user } = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ orderId, status, state }: any) => {
      if (isNoEditUser) {
        toast.error(`Action not allowed`, { duration: 5000 });
        throw new Error();
      }

      console.log("🚀 ~ useChangeOrderStatus ~ user:", user);

      await axios.servicesClient.post("api/orders/changeOrderStatus", {
        orderId,
        status,
        state,
        //@ts-ignore
        username: user?.username,
      });

      return orderId;
    },
    onSuccess: () => {
      refetch();
      refetchOrder();
      refetchCount();
      setOrderUnderActionId("");
      toast.success(`Order Status Updated Successfully`, { duration: 5000 });
    },
    onError: () => {
      setOrderUnderActionId("");
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { editStatusAndState: mutate, isPending };
};
