import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";

export const useGenerateMultiplePickLists = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (ordersIds: string[]) => {
      const pickListUrl = await magento.mutations.generatePickLists(
        ordersIds.toString(),
      );
      return pickListUrl;
    },
    onSuccess: (pickListUrl) => {
      window.open(pickListUrl);
      toast.success(`Pick Lists Generated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { generatePickLists: mutate, isPending };
};
