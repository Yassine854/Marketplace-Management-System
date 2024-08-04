import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAllSuppliers = () => {
  const { isLoading, data: suppliers } = useQuery({
    queryKey: ["suppliers"],

    queryFn: async () => {
      const { data }: any = await axios.servicesClient.get(
        "/api/suppliers/getAllSuppliers",
      );

      return data?.suppliers;
    },
  });

  return {
    isLoading,
    suppliers,
  };
};
