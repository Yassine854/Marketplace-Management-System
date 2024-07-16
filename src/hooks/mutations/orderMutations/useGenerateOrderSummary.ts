import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";

export const useGenerateOrderSummary = () => {
  const [pendingOrderId, setPendingOrderId] = useState<string>("");

  const { mutate } = useMutation({
    mutationFn: async (orderId: string) => {
      setPendingOrderId(orderId);
      const pdfUrl = await magento.generateOrderSummary(orderId);
      return pdfUrl;
    },
    onSuccess: (pdfUrl) => {
      setPendingOrderId("");

      window.open(pdfUrl, "_blank");

      toast.success(`Order Summary Generated Successfully`, { duration: 5000 });
    },
    onError: () => {
      setPendingOrderId("");
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return {
    generateSummary: mutate,
    pendingOrderId,
  };
};
