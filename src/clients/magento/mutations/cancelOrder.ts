import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const cancelOrder = async (orderIds: string | string[]): Promise<any> => {
  try {
     let orderIdsArray: string[];

    if (typeof orderIds === "string") {
       orderIdsArray = orderIds.split(',').map((id: string) => id.trim());
    } else if (Array.isArray(orderIds)) {
       orderIdsArray = orderIds;
    } else {
      throw new Error('Invalid orderIds format. It should be a string or an array.');
    }

     const orderIdsString = orderIdsArray.join(',');

    //console.log('Sending payload:', JSON.stringify({ orderIds: orderIdsString }));

    const res = await axios.magentoClient.put(`orders/cancel`, {
      orderIds: orderIdsString,
    });

    return res?.data;
  } catch (error: any) {
    logError(error);

    const errorPayload = { orderIds: Array.isArray(orderIds) ? orderIds.join(',') : orderIds };
    const errorMessage = `Error occurred while canceling orders. Payload: ${JSON.stringify(errorPayload)}. ${error?.response?.data?.message || 'An error occurred.'}`;

    throw new Error(errorMessage);
  }
};
