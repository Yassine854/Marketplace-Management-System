import { magento } from "@/libs/magento";

export const onGenerateDeliveryNotesClick = async (
  ordersIdsList: string[],
): Promise<any> => {
  try {
    const deliveryNotesUrl = await magento.generateDeliveryNotes(
      ordersIdsList.toString(),
    );
    window.open(deliveryNotesUrl);
  } catch (error) {}
};
