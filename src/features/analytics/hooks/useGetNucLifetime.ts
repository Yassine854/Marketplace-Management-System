import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNucLifetime = () => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["nucLifetime"],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/nuc/lifetime`,
      );
      return data?.data;
    },
  });
  return {
    data,
    refetch,
    isLoading: isLoading,
  };
};
