import { useEffect, useState } from "react";
import { useOrdersStore } from "@/stores/ordersStore";

export const useShippedCounter = ({ pcb, id }: any) => {
  const {
    orderOnReviewItems,
    setOrderOnReviewItems,
    orderOnReviewItemsBeforeEdit,
  } = useOrdersStore();
  const min = 0;
  const [item, setItem] = useState();
  const [itemBeforeEdit, setItemBeforeEdit] = useState();

  const incrementShipped = (id: any) => {
    const items: any = orderOnReviewItems.map((item: any) => {
      if (item?.id === id) {
        useShippedCounter;
        const newShipped = item?.shipped + pcb;

        return {
          ...item,
          shipped: newShipped,
          totalPrice: newShipped * item.productPrice,
        };
      }
      return item;
    });

    setOrderOnReviewItems(items);
  };

  const decrementShipped = (id: any) => {
    const items = orderOnReviewItems.map((item: any) => {
      if (item?.id === id) {
        const newShipped = item?.shipped - pcb;
        return {
          ...item,
          shipped: newShipped,
          totalPrice: newShipped * item.productPrice,
        };
      }
      return item;
    });

    setOrderOnReviewItems(items);
  };

  useEffect(() => {
    if (orderOnReviewItems) {
      const item = orderOnReviewItems.find((item: any) => item?.id === id);
      setItem(item);
      //   //@ts-igno
    }
  }, [id, setItem, orderOnReviewItems]);

  useEffect(() => {
    if (orderOnReviewItemsBeforeEdit) {
      const item = orderOnReviewItemsBeforeEdit.find(
        (item: any) => item?.id === id,
      );
      setItemBeforeEdit(item);
      //   //@ts-igno
    }
  }, [id, setItemBeforeEdit, orderOnReviewItemsBeforeEdit]);

  return { incrementShipped, decrementShipped, item, itemBeforeEdit };
};
