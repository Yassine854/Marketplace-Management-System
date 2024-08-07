import { typesenseClient } from "../typesenseClient";
import { typesenseOrdersCollectionSchema } from "../schemas/OrdersCollectionSchema";

export const createOrdersCollection = async (): Promise<any> =>
  typesenseClient.collections().create(typesenseOrdersCollectionSchema);
