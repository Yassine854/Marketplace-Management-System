import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";
import { useGetMilkRunOrders } from "../queries/useGetMilkRunOrders";
import { prisma } from "@/clients/prisma";
import { useAuth } from "@/features/shared/hooks/useAuth";

export const useEditOrdersMilkRun = () => {
  const { refetch } = useGetMilkRunOrders();

  const { user } = useAuth();

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

          await axios.servicesClient.put("/api/delivery/editMilkRun", {
            order: {
              id: orderId.toString(),
              orderId: orderId.toString(),
              deliverySlot,
              deliveryAgentName,
              deliveryAgentId: deliveryAgentId.toString(),
            },
            //@ts-ignore
            username: user?.username,
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
