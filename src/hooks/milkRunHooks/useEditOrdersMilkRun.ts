import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";

export const useEditOrdersMilkRun = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      ordersIds,
      deliverySlot,
      deliveryAgentName,
      deliveryAgentId,
    }: any) => {
      Promise.all(
        ordersIds.map(async (orderId: string) => {
          await magento.editOrderMilkRun({
            orderId,
            deliverySlot,
            deliveryAgentName,
            deliveryAgentId,
          });
          await axios.servicesClient.put("/api/orders/typesense/edit-order", {
            order: {
              id: orderId,
              deliverySlot,
              deliveryAgentName,
              deliveryAgentId: deliveryAgentId,
            },
          });
        }),
      );
    },
    onSuccess: () => {
      toast.success(`Orders Milk Run Updated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { editOrdersMilkRun: mutate, isPending };
};
