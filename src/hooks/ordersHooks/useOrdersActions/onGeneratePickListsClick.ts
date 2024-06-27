import { generatePickLists } from "@/libs/magento/generatePickLists";

export const onGeneratePickListsClick = async (
  ordersIdsList: string[],
): Promise<any> => {
  try {
    const pickListUrl = await generatePickLists(ordersIdsList.toString());
    window.open(pickListUrl);
  } catch (error) {}
};
