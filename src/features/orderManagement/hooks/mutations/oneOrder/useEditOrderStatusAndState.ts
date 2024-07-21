import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";
import { useOrdersCount } from "../../queries/useOrdersCount";
import { useOrdersData } from "../../queries/useOrdersData";

export const useEditOrderStatusAndState = () => {
  const { refetch } = useOrdersData();
  const { refetch: refetchCount } = useOrdersCount();
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

      return orderId;
    },
    onSuccess: (orderId) => {
      refetch();
      refetchCount();
      toast.success(`Order Status Updated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { editStatusAndState: mutate, isPending };
};
