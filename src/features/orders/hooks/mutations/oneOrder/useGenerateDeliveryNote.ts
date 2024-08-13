import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";
import { useOrderActionsStore } from "@/features/orders/stores/orderActionsStore";

export const useGenerateDeliveryNote = () => {
  const { setOrderUnderActionId } = useOrderActionsStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async (orderId: string) => {
      const deliveryNotesUrl =
        await magento.mutations.generateMultipleOrdersDeliveryNotes(
          [orderId].toString(),
        );

      return deliveryNotesUrl;
    },
    onSuccess: (deliveryNotesUrl) => {
      window.open(deliveryNotesUrl);
      setOrderUnderActionId("");
      toast.success(`Order Delivery Note Generated Successfully`, {
        duration: 5000,
      });
    },
    onError: () => {
      setOrderUnderActionId("");
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { generateDeliveryNote: mutate, isPending };
};
