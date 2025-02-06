import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const editOrderMilkRun = async ({
  orderId,
  deliverySlot,
  deliveryAgentName,
  deliveryAgentId,
  status,
  state,
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
    await axios.magentoClient.put("orders/delivery_info", data);
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
