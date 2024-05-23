import { typesenseClient } from "@/libs/typesense/typesenseClient";

export const deleteOrdersCollection = async () => {
  try {
    console.log("Orders Collection delete ...");

    await typesenseClient.collections("orders").delete();

    console.log("Orders Collection deleted successfully ");
  } catch (err) {
    console.error(err);
    throw new Error();
  }
};
