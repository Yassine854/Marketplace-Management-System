import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { convertIsoDate2MagentoDate } from "@/utils/date/convertIsoDate2MagentoDate";
import { isValidISODate } from "@/utils/date/isValidIsoDate";
export const editOrderDetails = async ({
  orderId,
  deliveryDate,
  items,
  total,
  status,
  state,
}: any): Promise<any> => {
  try {
    const magentoItems = items?.map((item: any) => {
      return { item_id: item.id, weight: item.weight };
    });

    let data;

    if (isValidISODate(deliveryDate)) {
      data = {
        entity: {
          entity_id: orderId,
        
          items: magentoItems,
          total: total || 0,
         
          extension_attributes: {
            delivery_date: convertIsoDate2MagentoDate(deliveryDate),
          },
        },
      };
    } else {
      data = {
        entity: {
          entity_id: orderId,
          items: magentoItems,
          total: total || 0,
        
          
        },
      };
    }

    await axios.magentoClient.put("orders/update_qty", data);
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
