import { axios } from "@/libs/axios";

export const editOrderMilkRun = async ({
  orderId,
  deliverySlot,
  deliveryAgentName,
  deliveryAgentId,
}: any): Promise<any> => {
  try {
    const data = {
      entity: {
        entity_id: orderId,
        extension_attributes: {
          delivery_slot: deliverySlot,
          delivery_agent: deliveryAgentName,
          delivery_agent_id: deliveryAgentId,
        },
      },
    };
    await axios.magentoClient.put("orders/create", data);
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error editing order milk run:", error);
    throw error;
  }
};
