import { typesense } from "@/clients/typesense";

export const getOrder = async (
  orderId: string,
): Promise<{ id: string } | undefined> => {
  try {
    const order = await typesense.orders.getOne(orderId);
    return order;
  } catch (error) {
    process.env.NODE_ENV === "development" && console.error(error);
  }
};
