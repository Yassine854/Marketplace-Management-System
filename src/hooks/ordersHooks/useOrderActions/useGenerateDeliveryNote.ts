import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { magento } from "@/libs/magento";

export const useGenerateDeliveryNote = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (orderId: string) => {
      const deliveryNotesUrl = await magento.generateDeliveryNotes(
        [orderId].toString(),
      );

      return deliveryNotesUrl;
    },
    onSuccess: (deliveryNotesUrl) => {
      console.log(
        "🚀 ~ useGenerateDeliveryNote ~ deliveryNotesUrl:",
        deliveryNotesUrl,
      );
      window.open(deliveryNotesUrl);

      toast.success(`Order Delivery Note Generated Successfully`, {
        duration: 5000,
      });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { generateDeliveryNote: mutate, isPending };
};
