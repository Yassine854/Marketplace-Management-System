import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useOrderActionsStore } from "@/features/orders/stores/orderActionsStore";
import { axios } from "@/libs/axios";

export const useGeneratePickList = () => {
  const { setOrderUnderActionId } = useOrderActionsStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await axios.servicesClient.post(
        "/api/orders/generatePickLists",
        {
          ordersIds: [orderId].toString(),
        },
      );

      const pickListUrl = data?.url;

      return pickListUrl;
    },
    onSuccess: (pickListUrl) => {
      window.open(pickListUrl);
      setOrderUnderActionId("");
      toast.success(`Pick List Generated Successfully`, { duration: 5000 });
    },
    onError: () => {
      setOrderUnderActionId("");
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { generatePickList: mutate, isPending };
};
