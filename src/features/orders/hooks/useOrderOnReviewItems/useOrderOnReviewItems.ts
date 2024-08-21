import { useEffect } from "react";
import { useGetOrder } from "../queries/useGetOrder";
import { useOrderDetailsStore } from "../../stores/orderDetailsStore";
import { convertUnixTimestampToIsoDate } from "@/utils/date/convertUnixTimestamp2IsoDate";

export const useOrderOnReviewItems = () => {
  const {
    orderOnReviewId,
    setOrderOnReviewItems,
    setOrderOnReviewDeliveryDate,
    orderOnReviewItems,
  } = useOrderDetailsStore();

  const { order, isLoading } = useGetOrder(orderOnReviewId);

  useEffect(() => {
    if (order) {
      setOrderOnReviewItems(order.items);
      setOrderOnReviewDeliveryDate(
        convertUnixTimestampToIsoDate(order?.deliveryDate),
      );
    }
  }, [order, setOrderOnReviewItems]);

  return { orderOnReviewItems, isLoading };
};
