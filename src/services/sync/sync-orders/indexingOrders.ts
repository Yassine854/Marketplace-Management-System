import { getOrdersBatch } from "./getOrderBatch";
import { typesenseClient } from "@/libs/typesenseClient";

export const indexingOrders = async (magentoOrders: any, callback: any) => {
  try {
    const ordersBatch = getOrdersBatch(magentoOrders);

    await typesenseClient
      .collections("orders")
      .documents()
      .import(ordersBatch, { action: "upsert" });

    callback();
  } catch (err) {
    console.error(err);
    callback(err);
  }
};
