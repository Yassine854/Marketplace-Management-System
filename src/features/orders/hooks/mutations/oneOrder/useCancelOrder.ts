import { useUsersStore } from "@/features/users/stores/usersStore"; 
import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
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

  const { userOnReviewUsername } = useUsersStore();  
  const { user } = useAuth();

  const { mutate, isPending, mutateAsync, isError } = useMutation({
    mutationFn: async (orderId: string[]) => {
      if (isNoEditUser) {
        toast.error(`Action not allowed`, { duration: 5000 });
        throw new Error();
      }

    /*  if (!userOnReviewUsername) {
        toast.error(`User is not authenticated properly`, { duration: 5000 });
        throw new Error("No username found");
      }*/

      await axios.servicesClient.post("/api/orders/cancelOrder", {
        orderId,
        username: user,  
      });
    },
    onSuccess: () => {
      refetch();
      refetchCount();
      refetchOrder();
      setOrderToCancelId("");
      setOrderUnderActionId("");
      toast.success(`Orders Canceled Successfully`, { duration: 5000 });
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
