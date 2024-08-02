import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNumberOfOrdersByMonthAnalytics = (
  year: number,
  month: number,
) => {
  const { isLoading, data } = useQuery({
    queryKey: ["numberOfOrdersByMonthAnalytics", year, month],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/numberOfOrders/byMonth?year=${year}&month=${month}`,
      );
      return data?.data;
    },
  });

  return {
    data,
    isLoading,
  };
};
