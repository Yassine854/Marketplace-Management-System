import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";
import { useOrderActionsStore } from "@/features/orderManagement/stores/orderActionsStore";

export const useGeneratePickList = () => {
  const { setOrderUnderActionId } = useOrderActionsStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async (orderId: string) => {
      const pickListUrl = await magento.mutations.generatePickLists(
        [orderId].toString(),
      );
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
