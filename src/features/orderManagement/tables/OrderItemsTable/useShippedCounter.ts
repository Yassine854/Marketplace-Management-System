import { useEffect, useState } from "react";
import { useOrderDetailsStore } from "@/stores/orderDetailsStore";
import toast from "react-hot-toast";

export const useShippedCounter = (id: string) => {
  const { orderOnReviewItems, setOrderOnReviewItems } = useOrderDetailsStore();
  const [item, setItem] = useState<any>();

  const incrementShipped = (id: any) => {
    if (item?.shipped === item.quantity) {
      toast.error("You can't add more");
    } else {
      const items: any = orderOnReviewItems.map((item: any) => {
        if (item?.id === id) {
          useShippedCounter;
          const newShipped = item?.shipped + item?.pcb;

          return {
            ...item,
            shipped: newShipped,
            totalPrice: newShipped * item.productPrice,
          };
        }
        return item;
      });

      setOrderOnReviewItems(items);
    }
  };

  const decrementShipped = (id: string) => {
    //@ts-ignore
    if (item?.shipped === 0) {
      toast.error("You can't remove more");
    } else {
      const items = orderOnReviewItems.map((item: any) => {
        if (item?.id === id) {
          const newShipped = item?.shipped - item?.pcb;
          return {
            ...item,
            shipped: newShipped,
            totalPrice: newShipped * item.productPrice,
          };
        }
        return item;
      });

      setOrderOnReviewItems(items);
    }
  };

  useEffect(() => {
    if (orderOnReviewItems) {
      const item = orderOnReviewItems.find((item: any) => item?.id === id);
      setItem(item);
      //   //@ts-igno
    }
  }, [id, setItem, orderOnReviewItems]);

  return { incrementShipped, decrementShipped, item };
};
