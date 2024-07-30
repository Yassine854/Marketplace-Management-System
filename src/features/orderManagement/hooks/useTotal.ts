import { useEffect } from "react";
import { useOrderDetailsStore } from "../stores/orderDetailsStore";

export const useTotal = () => {
  const { orderOnReviewItems, setTotal } = useOrderDetailsStore();

  useEffect(() => {
    let total = 0;
    orderOnReviewItems.forEach((item: any) => {
      total += item.weight * item.productPrice;
    });

    setTotal(total);
  }, [orderOnReviewItems, setTotal]);
};
