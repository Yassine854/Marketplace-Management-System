import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { magento } from "@/libs/magento";

export const useGeneratePickList = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (orderId: string) => {
      const pickListUrl = await magento.generatePickLists([orderId].toString());
      return pickListUrl;
    },
    onSuccess: (pickListUrl) => {
      window.open(pickListUrl);
      toast.success(`Pick List Generated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { generatePickList: mutate, isPending };
};
