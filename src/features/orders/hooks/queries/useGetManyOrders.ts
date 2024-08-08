import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetManyOrders = ({
  page,
  perPage,
  search,
  sortBy,
  filterBy,
}: any) => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["useGetManyOrders", page, perPage, search, sortBy, filterBy],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/orders/getManyOrders?sortBy=${sortBy}&search=${search}&page=${page}&filterBy=${filterBy}&perPage=${perPage}`,
      );

      return data;
    },
  });

  return {
    isLoading,
    refetch,
    data,
  };
};
