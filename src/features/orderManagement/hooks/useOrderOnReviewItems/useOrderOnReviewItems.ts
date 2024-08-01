import { useEffect, useState } from "react";
import { getMergedItems } from "./getMergedItems";
import { useGetOrder } from "../queries/useGetOrder";
import { useGetOrderItems } from "../queries/useGetOrderItems";
import { useOrderDetailsStore } from "../../stores/orderDetailsStore";

export const useOrderOnReviewItems = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { orderOnReviewId, setOrderOnReviewItems, orderOnReviewItems } =
    useOrderDetailsStore();

  const { data: order, isLoading: isOrderLoading } = useGetOrder();

  const { data: orderItems, isLoading: isOrderItemsLoading } =
    useGetOrderItems(orderOnReviewId);

  useEffect(() => {
    if (order && orderItems) {
      console.log("🚀 ~ useEffect ~ orderItems:", orderItems);
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
