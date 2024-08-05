import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGmvByMonthAnalytics = (month: number, year: number) => {
  const { isLoading, data,refetch } = useQuery({
    queryKey: ["gmvByMonthAnalytics", year],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/gmv/byMonth?year=${year}&month=${month}`,
      );
      return data?.data;
    },
  });
  return {
    dataMonth: data,
    isLoadingMonth: isLoading,
    refetch
  };
};
