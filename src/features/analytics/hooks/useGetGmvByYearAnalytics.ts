import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGmvByYearAnalytics = (year: number) => {
  const { isLoading, data } = useQuery({
    queryKey: ["gmvByYearAnalytics", year],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/gmv/byYear?year=${year}`,
      );
      const newList = data?.data.gmv.map((gmvNumber: number) => {
        const numberString = gmvNumber.toString();
        const dotPosition = numberString.indexOf(".");
        const decimalPart =
          dotPosition !== -1 ? numberString.substring(0, dotPosition) : "";
        return Number(decimalPart);
      });
      return newList;
    },
  });
  return {
    dataYear: data,
    isLoadingYear: isLoading,
  };
};
