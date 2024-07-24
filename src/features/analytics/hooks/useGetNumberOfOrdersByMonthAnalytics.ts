import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNumberOfOrdersByMonthAnalytics = (month: string) => {
  const { isLoading, data } = useQuery({
    queryKey: ["numberOfOrdersByMonthAnalytics", month],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/numberOfOrders/byMonth?month=${month}`,
      );
      console.log("API response for", month, ":", data); // Log API response
      return data?.data;
    },
  });

  return {
    data,
    month,
    isLoading,
  };
};
