import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useGetNooByMonth = (year: number, month: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useQuery({
    queryKey: ["numberOfOrdersByMonthAnalytics", year, month],
    queryFn: async () => {
      setIsLoading(true);
      const { data } = await axios.servicesClient(
        `/api/analytics/noo/byMonth?year=${year}&month=${month}`,
      );

      setIsLoading(false);

      return data?.data;
    },
  });

  return {
    data,
    isLoading,
  };
};
