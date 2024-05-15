import { isCollectionExist } from "./isCollectionExist";
import { ordersSchema } from "./ordersSchema";
import { typesenseClient } from "@/libs/typesenseClient";

export const ordersCollectionInit = async () => {
  try {
    const isOrdersCollectionExist = await isCollectionExist("orders");
    //@ts-ignore
    if (!isOrdersCollectionExist) {
      console.log("Creating orders Collection...");

      //@ts-ignore
      await typesenseClient.collections().create(ordersSchema);

      console.log("orders collection created Successfully...");
    }
  } catch (err) {
    console.error(err);
  }
};
