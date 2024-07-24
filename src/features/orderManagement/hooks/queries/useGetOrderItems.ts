import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetOrderItems = (orderId: string) => {
  const { isLoading, data } = useQuery({
    queryKey: ["orderItems", orderId],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/orders/magento/getOrderItems?orderId=${orderId}`,
      );

      return data?.orderItems || [];
    },
  });

  return {
    data,
    isLoading,
  };
};
