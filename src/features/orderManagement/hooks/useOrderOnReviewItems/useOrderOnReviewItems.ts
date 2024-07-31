import { useEffect, useState } from "react";
import { useGetOrder } from "../queries/useGetOrder";
import { useGetOrderItems } from "../queries/useGetOrderItems";
import { useOrderDetailsStore } from "../../stores/orderDetailsStore";

const getMergedItems = (orderItems1: any, orderItems2: any): any[] => {
  if (orderItems1 && orderItems2) {
    const mergedItems = orderItems1.map((item: any) => {
      const product = orderItems2?.find((p: any) => p.sku == item.sku);

      return { ...item, ...product };
    });

    return mergedItems;
  }
  return [];
};

export const useOrderOnReviewItems = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { orderOnReviewId, setOrderOnReviewItems, orderOnReviewItems } =
    useOrderDetailsStore();

  const { data: order, isLoading: isOrderLoading } = useGetOrder();

  const { data: orderItems, isLoading: isOrderItemsLoading } =
    useGetOrderItems(orderOnReviewId);

  useEffect(() => {
    if (order && orderItems) {
      const mergedItems = getMergedItems(order?.items, orderItems);
      setOrderOnReviewItems(mergedItems);
    }
  }, [order, orderItems, setOrderOnReviewItems]);

  useEffect(() => {
    if (isOrderLoading || isOrderItemsLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isOrderLoading, isOrderItemsLoading]);

  return { orderOnReviewItems, isLoading };
};
