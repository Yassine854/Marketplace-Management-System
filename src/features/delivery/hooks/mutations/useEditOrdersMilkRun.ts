import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";
import { useMilkRunStore } from "../../stores/milkRunStore";
import { useGetMilkRunOrders } from "../queries/useGetMilkRunOrders";

export const useEditOrdersMilkRun = () => {
  const { deliveryDate } = useMilkRunStore();
  const { refetch } = useGetMilkRunOrders();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      ordersIds,
      deliverySlot,
      deliveryAgentId,
      deliveryAgentName,
    }: any) => {
      await Promise.all(
        ordersIds.map(async (orderId: string) => {
          await magento.mutations.editOrderMilkRun({
            orderId,
            deliverySlot,
            deliveryAgentName,
            deliveryAgentId,
          });

          await axios.servicesClient.put("/api/typesense/editOrder", {
            order: {
              id: orderId.toString(),
              deliverySlot,
              deliveryAgentName,
              deliveryAgentId: deliveryAgentId.toString(),
            },
          });
        }),
      );
    },
    onSuccess: () => {
      refetch();

      toast.success(`Orders Milk Run Updated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { editOrdersMilkRun: mutate, isPending };
};
