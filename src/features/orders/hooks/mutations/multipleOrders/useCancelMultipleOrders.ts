import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useOrdersData } from "../../queries/useOrdersData";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useGetOrdersCount } from "../../queries/useGetOrdersCount";

export const useCancelMultipleOrders = () => {
  const { refetch } = useOrdersData();

  const { isNoEditUser } = useGlobalStore();

  const { refetch: refetchCount } = useGetOrdersCount();

  const { mutate, isPending, mutateAsync } = useMutation({
    mutationFn: async (ordersIds: string[]) => {
      if (isNoEditUser) {
        toast.error(`Action not allowed`, { duration: 5000 });
        throw new Error();
      }
      return Promise.all(
        ordersIds.map(async (orderId) => {
          await axios.servicesClient.post("/api/orders/cancelOrder", {
            orderId,
          });
        }),
      );
    },
    onSuccess: () => {
      refetch();
      refetchCount();
      toast.success(`Orders Canceled  Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return {
    cancelMultipleOrders: mutate,
    cancelMultipleOrdersAsync: mutateAsync,
    isPending,
  };
};
