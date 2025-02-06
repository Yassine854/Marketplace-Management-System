import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const changeOrderStatus = async ({
  orderId,
  status,
  state,
}: any): Promise<any> => {
  try {
    let response;
    if (status === "unpaid") {
      const data = {
        orders: orderId,
      };

      response = await axios.magentoClient.post("orders/manage/complete", data);
      //console.log("Response from orders/manage/complete:", response.data);


    } else {

      const data = {
  orders: [
    {
      orderId: orderId, // each order will have an orderId
      status: status,
      state: state,
    },
  ],
};

      response = await axios.magentoClient.put("orders/status_change", data);
      //console.log("Response from :najeh ", response);
    }
    return response.data;
    
     // Return the response data
  } catch (error) {
    logError(error);
    throw new Error("Failed to change order status");
  }
};
