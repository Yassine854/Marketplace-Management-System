import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";

export const useGenerateOrderSummary = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (orderId: string) => {
      const pdfUrl = await magento.mutations.generateOrderSummary(orderId);
      return pdfUrl;
    },
    onSuccess: (pdfUrl) => {
      window.open(pdfUrl, "_blank");
      toast.success(`Order Summary Generated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return {
    generateSummary: mutate,
    isPending,
  };
};
