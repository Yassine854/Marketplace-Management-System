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
      console.log("🚀 ~ useEffect ~ order:", order);
      setOrderOnReviewItems(order.items);
      setOrderOnReviewDeliveryDate(
        convertUnixTimestampToIsoDate(order?.deliveryDate),
      );
    }
  }, [order, setOrderOnReviewItems]);

  return { orderOnReviewItems, isLoading };
};
