import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { axios } from "@/libs/axios";
import { magento } from "@/clients/magento";

export const useEditOrderStatusAndState = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ orderId, status, state }: any) => {
      await magento.changeOrderStatus({ orderId, status, state });
      await axios.servicesClient.put("/api/orders/typesense/edit-order", {
        order: {
          id: orderId,
          status,
          state,
        },
      });
    },
    onSuccess: () => {
      toast.success(`Order Status Updated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { editStatusAndState: mutate, isPending };
};
