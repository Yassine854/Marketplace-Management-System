import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const changeOrderStatus = async ({
  orderId,
  status,
  state,
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
