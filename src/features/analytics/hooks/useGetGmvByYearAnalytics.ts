import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGmvByYearAnalytics = (year: number) => {
  const { isLoading, data } = useQuery({
    queryKey: ["gmvByYearAnalytics", year],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/gmv/byYear?year=${year}`,
      );
      return data?.data;
    },
  });
  return {
    dataYear: data,
    isLoadingYear: isLoading,
  };
};
