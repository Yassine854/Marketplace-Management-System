import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import createAuditLog from "@/services/auditing";

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

    //@ts-ignore
    await createAuditLog({
      //id: orderId,
      username,
      userid: userId,
      action: `Changed order status to ${status}`,
      actionTime: new Date(),
      orderid: orderId,
    });
    console.log("🚀 ~ createAuditLog:", createAuditLog);
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
