import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetDeliveryAgents = () => {
  const {
    isLoading,
    data: deliveryAgents,
    fetchStatus,
    isPending,
  } = useQuery({
    queryKey: ["deliveryAgents"],
    networkMode: "always",
    //  behavior:'',

    queryFn: async () => {
      const { data }: any = await axios.servicesClient.get(
        "/api/delivery/getAllDeliveryAgents",
      );

      return data?.deliveryAgents;
    },
  });

  useEffect(() => {
    console.log("🚀 ~ useGetDeliveryAgents ~ isPending:", isPending);
  }, [isPending]);
  useEffect(() => {
    console.log("🚀 ~ useGetDeliveryAgents ~ fetchStatus:", fetchStatus);
  }, [fetchStatus]);

  const isLoadingV3 = isLoading && fetchStatus !== "idle";
  return {
    isLoading: isLoadingV3,
    deliveryAgents,
  };
};
