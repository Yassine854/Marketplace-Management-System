import { generatePickList } from "@/libs/magento/generatePickList";

export const onGeneratePickListClick = async (
  ordersIdsList: string[],
): Promise<any> => {
  try {
    const pickListUrl = await generatePickList(ordersIdsList.toString());
    window.open(pickListUrl);
  } catch (error) {}
};
