import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";

export const useGenerateSupplierReport = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ supplierId, fromDate, toDate }: any) => {
      const deliveryNotesUrl = await magento.mutations.generateSupplierReport({
        supplierId,
        fromDate,
        toDate,
      });

      return deliveryNotesUrl;
    },
    onSuccess: (deliveryNotesUrl) => {
      window.open(deliveryNotesUrl);

      toast.success(`Supplier Report  Generated Successfully`, {
        duration: 5000,
      });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { generateSupplierReport: mutate, isPending };
};
