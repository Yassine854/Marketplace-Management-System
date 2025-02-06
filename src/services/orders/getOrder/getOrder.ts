import { logError } from "@/utils/logError";
import { typesense } from "@/clients/typesense";
import { getMergedItems } from "./getMergedItems";
import { getOrderProducts } from "../getOrderProducts";

export const getOrder = async (id: string): Promise<any> => {
  try {
    const typesenseOrder: any = await typesense.orders.getOne(id);
    const typesenseOrderItems = typesenseOrder?.items;

    const magentoOrderProducts = await getOrderProducts(id);

     
    const mergedItems = magentoOrderProducts.length > 0 
      ? getMergedItems({
          typesenseOrderItems,
          magentoOrderProducts,
        }) 
      : typesenseOrderItems;

    const order = { ...typesenseOrder, items: mergedItems };
    return order;
  } catch (error) {
    logError(error);
    throw new Error(`Failed to get order with ID: ${id}`);  
  }
};

