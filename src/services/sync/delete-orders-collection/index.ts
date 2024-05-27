import { typesenseClient } from "@/libs/typesense";

export const deleteOrdersCollection = async () => {
  try {
    console.log("Orders Collection delete ...");

    await typesenseClient.collections("orders").delete();

    console.log("Orders Collection deleted successfully ");
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    throw new Error();
  }
};
