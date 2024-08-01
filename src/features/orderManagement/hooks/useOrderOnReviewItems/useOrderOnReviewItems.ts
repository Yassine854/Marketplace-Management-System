import { useEffect } from "react";
import { useGetOrder } from "../queries/useGetOrder";
import { useOrderDetailsStore } from "../../stores/orderDetailsStore";

export const useOrderOnReviewItems = () => {
  const { orderOnReviewId, setOrderOnReviewItems, orderOnReviewItems } =
    useOrderDetailsStore();

  const { order, isLoading } = useGetOrder(orderOnReviewId);

  useEffect(() => {
    if (order) {
      setOrderOnReviewItems(order.items);
    }
  }, [order, setOrderOnReviewItems]);

  return { orderOnReviewItems, isLoading };
};
