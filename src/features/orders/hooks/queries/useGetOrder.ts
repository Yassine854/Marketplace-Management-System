import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetOrder = (id: number) => {
  const {
    isLoading,
    data: order,
    refetch,
  } = useQuery({
    queryKey: ["getOrder", id],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/orders/getOrder?id=${id}`,
      );
      return data?.order;
    },
  });

  return {
    order,
    refetch,
    isLoading,
  };
};
