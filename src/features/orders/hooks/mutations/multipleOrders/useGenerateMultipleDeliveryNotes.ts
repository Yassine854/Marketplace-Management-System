import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";

export const useGenerateMultipleDeliveryNotes = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (ordersIds: string[]) => {
      const deliveryNotesUrl =
        await magento.mutations.generateMultipleOrdersSummaries(
          ordersIds.toString(),
        );

      return deliveryNotesUrl;
    },
    onSuccess: (deliveryNotesUrl) => {
      window.open(deliveryNotesUrl);

      toast.success(`Order Delivery Note Generated Successfully`, {
        duration: 5000,
      });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { generateDeliveryNotes: mutate, isPending };
};
