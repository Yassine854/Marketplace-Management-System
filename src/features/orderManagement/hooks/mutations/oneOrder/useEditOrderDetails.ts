import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";
import { useGetOrder } from "../../queries/useGetOrder";
import { useOrdersData } from "../../queries/useOrdersData";
import { useOrdersCount } from "../../queries/useOrdersCount";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useOrderActionsStore } from "@/features/orderManagement/stores/orderActionsStore";

const formatUnixTimestamp = (unixTimestamp: number): string => {
  const date = new Date(unixTimestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useEditOrderDetails = () => {
  const { refetch } = useOrdersData();

  const { isNoEditUser } = useGlobalStore();

  const { refetch: refetchOrder } = useGetOrder();

  const { refetch: refetchCount } = useOrdersCount();

  const {
    total,
    setIsInEditMode,
    orderOnReviewId,
    orderOnReviewItems,
    orderOnReviewDeliveryDate,
  } = useOrderDetailsStore();

  const { setOrderUnderActionId } = useOrderActionsStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (isNoEditUser) {
        toast.error(`Action not allowed`, { duration: 5000 });
        throw new Error();
      }

      const magentoItems: any[] = [];

      orderOnReviewItems?.forEach((item: any) => {
        magentoItems.push({ item_id: item.id, weight: item.weight });
      });

      await magento.mutations.editOrderDetails({
        total,
        orderId: orderOnReviewId,
        items: magentoItems,
        deliveryDate: formatUnixTimestamp(orderOnReviewDeliveryDate),
      });
      await axios.servicesClient.put("/api/orders/typesense/edit-order", {
        order: {
          total,
          id: orderOnReviewId,
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
