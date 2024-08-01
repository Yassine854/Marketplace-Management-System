import { logError } from "@/utils/logError";
import { typesense } from "@/clients/typesense";
import { getMergedItems } from "./getMergedItems";
import { getOrderProducts } from "../getOrderProducts";

export const getOrder = async (id: string): Promise<any> => {
  try {
    const typesenseOrder: any = await typesense.orders.getOne(id);

    const typesenseOrderItems = typesenseOrder?.items;
    console.log("🚀 ~ getOrder ~ typesenseOrderItems:", typesenseOrderItems);

    const magentoOrderProducts = await getOrderProducts(id);
    console.log("🚀 ~ getOrder ~ magentoOrderProducts:", magentoOrderProducts);

    const mergedItems = getMergedItems({
      typesenseOrderItems,
      magentoOrderProducts,
    });

    const order = { ...typesenseOrder, items: mergedItems };
    return order;
  } catch (error) {
    logError(error);
  }
};
