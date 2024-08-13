import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { convertIsoDate2MagentoDate } from "@/utils/date/convertIsoDate2MagentoDate";
import createAuditLog from "@/services/auditing";

export const editOrderDetails = async ({
  orderId,
  deliveryDate,
  items,
  total,
  userId,
  username,
}: any): Promise<any> => {
  try {
    const magentoItems = items?.map((item: any) => {
      return { item_id: item.id, weight: item.weight };
    });

    const data = {
      entity: {
        entity_id: orderId,
        items: magentoItems,
        base_subtotal: total,
        subtotal: total,
        base_grand_total: total,
        grand_total: total,
        extension_attributes: {
          delivery_date: convertIsoDate2MagentoDate(deliveryDate),
        },
      },
    };
    console.log("🚀 ~ data:", data);

    await axios.magentoClient.put("orders/create", data);
    //@ts-ignore
    await createAuditLog({
      username,
      userid: userId,
      action: `edit order `,
      actionTime: new Date(),

      orderid: orderId,
    });
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
