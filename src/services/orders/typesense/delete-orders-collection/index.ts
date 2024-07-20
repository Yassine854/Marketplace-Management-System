import { typesense } from "@/clients/typesense";

export const deleteOrdersCollection = async () => {
  try {
    console.info("Orders Collection delete ...");

    await typesense.orders.deleteCollection();

    console.info("Orders Collection deleted successfully ");
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    throw new Error();
  }
};
