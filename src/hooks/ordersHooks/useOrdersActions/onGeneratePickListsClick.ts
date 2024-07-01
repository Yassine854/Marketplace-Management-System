import { magento } from "@/libs/magento";

export const onGeneratePickListsClick = async (
  ordersIdsList: string[],
): Promise<any> => {
  try {
    const pickListUrl = await magento.generatePickLists(
      ordersIdsList.toString(),
    );
    window.open(pickListUrl);
  } catch (error) {}
};
