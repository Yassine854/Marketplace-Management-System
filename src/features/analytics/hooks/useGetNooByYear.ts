import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useGetNooByYear = (year: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useQuery({
    queryKey: ["NooByYear", year],
    queryFn: async () => {
      setIsLoading(true);
      const { data } = await axios.servicesClient(
        `/api/analytics/noo/byYear?year=${year}`,
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
