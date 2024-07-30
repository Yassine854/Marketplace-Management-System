import { useEffect } from "react";
import { useGetOrderItems } from "./queries/useGetOrderItems";
import { useGetOrder } from "./queries/useGetOrder";
import { useOrderDetailsStore } from "../stores/orderDetailsStore";

export const useOrderOnReviewItems = () => {
  const { orderOnReviewId, setOrderOnReviewItems } = useOrderDetailsStore();

  const { data: order, isLoading: isOrderLoading } = useGetOrder();

  const { data: orderItems, isLoading: isOrderItemsLoading } =
    useGetOrderItems(orderOnReviewId);

  useEffect(() => {
    if (order && orderItems) {
      const mergedItems = order?.items.map((item: any) => {
        const product = orderItems?.find(
          (p: any) => p.id === parseInt(item.productId),
        );

        return { ...item, ...product };
      });

      setOrderOnReviewItems(mergedItems);
    }
  }, [order, orderItems, setOrderOnReviewItems]);
};
