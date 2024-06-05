import { Readable } from "stream";
import { getMagentoOrders } from "../../../libs/magento/getMagentoOrders";
import { getPagesCount } from "./getPagesCount";

export function readingOrdersStream() {
  let page = 1;
  let isEnd = false;

  return new Readable({
    async read() {
      try {
        if (isEnd) {
          this.push(null);
          return;
        }

        const { pagesCount } = await getPagesCount();

        if (page <= pagesCount) {
          console.log("Fetching orders from page", page, "...");

          const { items } = await getMagentoOrders(page);

          this.push(JSON.stringify(items));
          page++;
          return;
        }

        isEnd = true;
        console.log("Orders fetching completed successfully");
      } catch (error) {
        this.emit("error", error);
      }
    },
  });
}
