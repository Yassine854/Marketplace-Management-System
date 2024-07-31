import { magento } from "@/clients/magento";
import { typesense } from "@/clients/typesense";
export const getOrder = async (id: string): Promise<any> => {
  const typesenseOrder = await typesense.orders.getOne(id);
  console.log("🚀 ~ getOrder ~ typesenseOrder:", typesenseOrder);
  const magentoOrderItems = await magento.queries.getOrderItems(id);
  console.log("🚀 ~ getOrder ~ magentoOrderItems:", magentoOrderItems);
};
