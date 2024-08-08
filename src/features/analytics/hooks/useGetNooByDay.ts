import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNooByDay = (date: number) => {
  const { isLoading, data } = useQuery({
    queryKey: ["nooByDay", date],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/noo/byDay?date=${date}`,
      );

      return data?.data;
    },
  });

  return {
    data,
    isLoading,
  };
};
