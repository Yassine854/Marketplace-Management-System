import { getOrdersBatch } from "./getOrdersBatch";
import { typesenseClient } from "@/libs/typesense";

export const indexingOrders = async (magentoOrders: any, callback: any) => {
  try {
    const ordersBatch = getOrdersBatch(magentoOrders);

    await typesenseClient
      .collections("orders")
      .documents()
      .import(ordersBatch, { action: "upsert" });

    callback();
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    callback(err);
  }
};
