import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGmvByMonth = ({ year, month }: any) => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["gmvByMonthAnalytics", year],
    queryFn: async () => {
      //@ts-ignore
      const { data } = await axios.servicesClient(
        `/api/analytics/gmv/byMonth?year=${year}&month=${month}`,
      );

      console.log("🚀 ~ queryFn: ~ data:", data);
      return { data: data?.data, total: data?.total };
    },
  });
  return {
    data: data?.data,
    total: data?.total,
    isLoading,
    refetch,
  };
};
