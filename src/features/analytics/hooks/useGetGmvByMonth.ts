import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGmvByMonth = ({ year, month }: any) => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["gmvByMonthAnalytics", year],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/gmv/byMonth?year=${year}&month=${month}`,
      );
      return data?.data;
    },
  });
  return {
    data,
    isLoading,
    refetch,
  };
};
