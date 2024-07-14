import { useQuery } from "@tanstack/react-query";
import { magento } from "@/libs/magento";

const formatDeliveryAgentsArray = (deliveryAgents: any) => {
  const response: any[] = [];

  deliveryAgents?.forEach((e: any) => {
    const agentFullName = e.custom_attributes.find(
      (e: any) => e["attribute_code"] === "full_name",
    );
    const agentPhone = e.custom_attributes.find(
      (e: any) => e["attribute_code"] === "phone_number",
    );
    const agent = {
      id: e.id,
      name: agentFullName.value,
      phone: agentPhone?.value,
    };

    response.push(agent);
  });

  return response;
};

export const useGetDeliveryAgents = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["deliveryAgents"],
    queryFn: async () => {
      const { deliveryAgents } = await magento.getDeliveryAgents();
      return formatDeliveryAgentsArray(deliveryAgents);
    },
  });

  return {
    deliveryAgents: data,
    isLoading,
  };
};
