import { Writable } from "stream";
import { indexingOrders } from "./indexingOrders";
import { ordersCollectionInit } from "./ordersCollectionInit";
import { readingOrdersStream } from "./readingOrdersStream";

export const startIndexingStream = async () => {
  try {
    await ordersCollectionInit();

    const readableStream = readingOrdersStream();
    const writableStream = new Writable({
      write(chunk: any, encoding: any, callback: any) {
        indexingOrders(chunk.toString(), encoding, callback);
      },
    });

    readableStream.on("error", (error: any) => {
      console.error("Stream error:", error);
    });

    writableStream.on("error", (error: any) => {
      console.error("Writable stream error:", error);
    });

    readableStream.pipe(writableStream);
  } catch (err) {
    console.error(err);
  }
};
