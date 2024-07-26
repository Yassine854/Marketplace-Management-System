import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNumberOfOrdersLifetimeAnalytics = (
  startYear: number,
  endYear: number,
) => {
  const { isLoading, data } = useQuery({
    queryKey: ["numberOfOrdersLifetimeAnalytics", startYear, endYear],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/numberOfOrders/lifetime?startYear=${startYear}&endYear=${endYear}`,
      );
      return data?.data;
    },
  });

  return {
    data,
    isLoading,
  };
};
