import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const editOrderDetails = async ({
  orderId,
  deliveryDate,
  items,
  total,
}: any): Promise<any> => {
  try {
    const data = {
      items: items,
      entity: {
        entity_id: orderId,
        base_subtotal: total,
        subtotal: total,
        base_grand_total: total,
        grand_total: total,
        extension_attributes: {
          delivery_date: deliveryDate,
        },
      },
    };
    await axios.magentoClient.put("orders/create", data);
  } catch (error) {
    logError(error);
    throw error;
  }
};
