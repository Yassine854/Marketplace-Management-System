import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
//import { magento } from "@/libs/magento";
import { axios } from "@/libs/axios";

export const useEditOrdersStatusesAndStates = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ ordersIds, status, state }: any) => {
      return Promise.all(
        ordersIds.map(async (orderId: string) => {
          await axios.servicesClient.put("/api/orders/typesense/edit-order", {
            order: {
              id: orderId,
              status,
              state,
            },
          });
        }),
      );
    },
    onSuccess: () => {
      toast.success(`Orders Statuses Updated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { editStatusesAndStates: mutate, isPending };
};
