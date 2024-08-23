import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetOrdersAuditTrail = (page: number) => {
  let {
    isLoading,
    data: auditTrail,
    refetch,
  } = useQuery({
    queryKey: ["ordersAuditTrail"],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/auditTrail/getOrdersAuditTrail?page=${page}`,
      );
      return data?.ordersLogs;
    },
  });

  return {
    auditTrail,
    refetch,
    isLoading,
  };
};
