import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";

export const useGenerateMultipleDeliveryNotes = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (ordersIds: string[]) => {
      const deliveryNotesUrl = await magento.mutations.generateMultipleOrdersSummaries(
        ordersIds.toString()
      );

      return deliveryNotesUrl;
    },
    onSuccess: (deliveryNotesUrl) => {
      const link = document.createElement('a');
      link.href = deliveryNotesUrl;
      link.download = 'order_summaries.zip'; 
      document.body.appendChild(link);
      link.click(); 
      document.body.removeChild(link); 

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
