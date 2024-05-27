import { isCollectionExist } from "./isCollectionExist";
import { typesenseClient } from "@/libs/typesense";
import { typesenseOrdersCollectionSchema } from "./typesenseOrdersCollectionSchema";

export const ordersCollectionInit = async () => {
  try {
    const isOrdersCollectionExist = await isCollectionExist("orders");

    if (!isOrdersCollectionExist) {
      console.log("Creating orders Collection...");

      await typesenseClient
        .collections()
        .create(typesenseOrdersCollectionSchema);

      console.log("orders collection created Successfully...");
    }
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
  }
};
