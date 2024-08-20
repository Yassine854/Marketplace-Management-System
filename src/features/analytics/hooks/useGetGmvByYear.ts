import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGmvByYear = (year: string) => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["gmvByYear", year],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/gmv/byYear?year=${year}`,
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
