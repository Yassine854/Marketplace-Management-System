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

        const { pagesCount } = await magento.queries.getAllOrdersPagesCount();

        if (page <= pagesCount) {
          console.info(
            "Fetching orders from page",
            page,
            "of",
            pagesCount,
            "total pages ...",
          );

          const { items } = await magento.queries.getOrdersByBatch(page);

          this.push(JSON.stringify(items));
          page++;
          return;
        }

        isEnd = true;
        console.info("Orders fetching completed successfully");
      } catch (error) {
        this.emit("error", error);
      }
    },
  });
};
