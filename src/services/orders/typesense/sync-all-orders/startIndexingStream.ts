import { Writable } from "stream";
import { NextResponse } from "next/server";
import { typesense } from "@/clients/typesense";
import { indexingOrders } from "./indexingOrders";
import { readingOrdersStream } from "./readingOrdersStream";

export const startIndexingStream = async () => {
  process.env.NODE_ENV === "development" && console.error("Syncing started");
  try {
    const isOrdersCollectionExist = await typesense.isCollectionExist("orders");

    if (!isOrdersCollectionExist) {
      console.log("Creating orders Collection...");

      await typesense.orders.createCollection();

      console.log("orders collection created Successfully...");
    }

    const readableStream = readingOrdersStream();
    const writableStream = new Writable({
      write(chunk: any, encoding: any, callback: any) {
        const magentoOrders = JSON.parse(chunk.toString());
        indexingOrders(magentoOrders, callback);
      },
    });

    readableStream.on("error", (error: any) => {
      process.env.NODE_ENV === "development" &&
        console.error("Stream error:", error);
    });

    writableStream.on("error", (error: any) => {
      process.env.NODE_ENV === "development" &&
        console.error("Writable stream error:", error);
    });

    readableStream.pipe(writableStream);

    return NextResponse.json("Orders Syncing ...", { status: 202 });
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
  }
};
