import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNumberOfUniqueCustomerByYearAnalytics = (year: number) => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["numberOfUniqueCustomerByYearAnalytics", year],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/nuc/byYear?year=${year}`,
      );
      return data?.data;
    },
  });

  return {
    data,
    refetch,
    isLoading,
  };
};
