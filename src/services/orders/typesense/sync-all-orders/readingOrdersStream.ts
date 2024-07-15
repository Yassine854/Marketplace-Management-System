import { Readable } from "stream";
import { magento } from "@/clients/magento";

export const readingOrdersStream = () => {
  let page = 1;
  let isEnd = false;

  return new Readable({
    async read() {
      try {
        if (isEnd) {
          this.push(null);
          return;
        }

        const { pagesCount } = await magento.getPagesCount();

        if (page <= pagesCount) {
          console.log("Fetching orders from page", page, "...");

          const { items } = await magento.getOrdersByBatch(page);

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
};
