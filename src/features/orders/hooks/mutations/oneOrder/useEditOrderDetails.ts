import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useGetOrder } from "../../queries/useGetOrder";
import { useOrdersData } from "../../queries/useOrdersData";
import { useGetOrdersCount } from "../../queries/useGetOrdersCount";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";
import { useOrderActionsStore } from "@/features/orders/stores/orderActionsStore";

export const useEditOrderDetails = () => {
  const { refetch } = useOrdersData();

  const { isNoEditUser } = useGlobalStore();

  const { refetch: refetchCount } = useGetOrdersCount();

  const {
    total,
    setIsInEditMode,
    orderOnReviewId,
    orderOnReviewItems,
    orderOnReviewDeliveryDate,
  } = useOrderDetailsStore();

  const { refetch: refetchOrder } = useGetOrder(orderOnReviewId);

  const { setOrderUnderActionId } = useOrderActionsStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (isNoEditUser) {
        toast.error(`Action not allowed`, { duration: 5000 });
        throw new Error();
      }

      await axios.servicesClient.put("/api/orders/editOrderDetails", {
        order: {
          total,
          orderId: orderOnReviewId,
          items: orderOnReviewItems,
          deliveryDate: orderOnReviewDeliveryDate,
        },
      });

      return orderOnReviewId;
    },
    onSuccess: () => {
      refetch();
      refetchCount();
      refetchOrder();
      setIsInEditMode(false);
      setOrderUnderActionId("");
      toast.success(`Order Details Updated Successfully`, { duration: 5000 });
    },

    onError: () => {
      setOrderUnderActionId("");
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { editDetails: mutate, isPending };
};
