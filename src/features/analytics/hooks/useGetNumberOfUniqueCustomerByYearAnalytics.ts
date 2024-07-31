import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNumberOfUniqueCustomerByYearAnalytics = (year: number) => {
  const { isLoading, data } = useQuery({
    queryKey: ["numberOfUniqueCustomerByYearAnalytics", year],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/analytics/numberOfUniqueCustomer/byYear?year=${year}`,
      );
      const list: number[] = [];
      data?.data.map((item: any) => {
        list.push(item.NumberOfUniqueCustomer);
      });
      return list;
    },
  });

  return {
    data,
    isLoading,
  };
};
