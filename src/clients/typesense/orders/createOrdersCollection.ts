import { typesenseClient } from "../typesenseClient";
import { typesenseOrdersCollectionSchema } from "../schema/OrdersCollectionSchema";

export const createOrdersCollection = async (): Promise<any> =>
  typesenseClient.collections().create(typesenseOrdersCollectionSchema);
