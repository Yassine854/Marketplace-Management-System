import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGmvLifetime = () => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["gmvLifetime"],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/gmv/lifetime`,
      );
      return { data: data?.data, total: data?.total };
    },
  });
  return {
    data: data?.data,
    total: data?.total,
    refetch,
    isLoading: isLoading,
  };
};
