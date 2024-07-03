import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
//import { magento } from "@/libs/magento";
import { axios } from "@/libs/axios";

export const useCancelOrder = (closeModal: any) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (orderId: string) => {
      //   await magento.cancelOrder(orderId);
      await axios.servicesClient.put("/api/orders/typesense/edit-order", {
        order: {
          id: orderId,
          status: "failed",
          state: "canceled",
        },
      });
    },
    onSuccess: () => {
      toast.success(`Order Canceled  Successfully`, { duration: 5000 });
      closeModal();
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
      closeModal();
    },
  });

  return { cancelOrder: mutate, isPending };
};
