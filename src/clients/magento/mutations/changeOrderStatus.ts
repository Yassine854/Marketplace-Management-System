import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { createAuditLog } from "@/services/auditing/orders";

export const changeOrderStatus = async ({
  orderId,
  status,
  state,
  userId,
  username,
}: any): Promise<any> => {
  try {
    const data = {
      entity: {
        entity_id: orderId,
        status,
        state,
      },
    };

    await axios.magentoClient.put("orders/create", data);
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
