import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNumberOfOrdersByQuarterAnalytics = (year: number) => {
  const { isLoading, data } = useQuery({
    queryKey: ["numberOfOrdersByQuarterAnalytics", year],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/numberOfOrders/byQuarter?date=${year}`,
      );

      return data?.data;
    },
  });

  return {
    data,
    isLoading,
  };
};
