import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { magento } from "@/clients/magento";
import { useMutation } from "@tanstack/react-query";
import { useOrdersCount } from "../../queries/useOrdersCount";
import { useOrdersData } from "../../queries/useOrdersData";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export const useEditOrdersStatusesAndStates = () => {
  const { refetch } = useOrdersData();
  const { refetch: refetchCount } = useOrdersCount();

  const { isNoEditUser } = useGlobalStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ ordersIds, status, state }: any) => {
      if (isNoEditUser) {
        toast.error(`Action not allowed`, { duration: 5000 });
        throw new Error();
      }

      return Promise.all(
        ordersIds.map(async (orderId: string) => {
          await magento.mutations.changeOrderStatus({ orderId, status, state });
          await axios.servicesClient.put("/api/typesense/editOrder", {
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
      refetch();
      refetchCount();
      toast.success(`Orders Statuses Updated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { editStatusesAndStates: mutate, isPending };
};
