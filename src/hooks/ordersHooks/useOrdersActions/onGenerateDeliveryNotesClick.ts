import { generateDeliveryNotes } from "@/libs/magento/generateDeliveryNotes";

export const onGenerateDeliveryNotesClick = async (
  ordersIdsList: string[],
): Promise<any> => {
  try {
    const deliveryNotesUrl = await generateDeliveryNotes(
      ordersIdsList.toString(),
    );
    window.open(deliveryNotesUrl);
  } catch (error) {}
};
