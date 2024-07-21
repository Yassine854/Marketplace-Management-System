import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useOrderActionsStore } from "@/features/orderManagement/stores/orderActionsStore";
import { useGetOrder } from "@/features/orderManagement/hooks/queries/useGetOrder";

export const useOrderDetailsEffect = (reset: any) => {
  const {
    orderOnReviewId,
    setOrderOnReviewItems,
    setOrderOnReviewDeliveryDate,
    orderOnReviewItems,
    setTotal,
  } = useOrderDetailsStore();

  const { orderUnderActionId } = useOrderActionsStore();

  const { data: order } = useGetOrder(orderOnReviewId);

  useEffect(() => {
    if (!orderUnderActionId) {
      reset();
    }
  }, [orderUnderActionId, reset]);

  useEffect(() => {
    !orderOnReviewId && redirect("/orders");
  }, [orderOnReviewId]);

  useEffect(() => {
    let total = 0;
    orderOnReviewItems.forEach((item: any) => {
      total += item.shipped * item.productPrice;
    });

    setTotal(total);
  }, [orderOnReviewItems, setTotal]);

  useEffect(() => {
    order && setOrderOnReviewItems(order?.items);
    order && setOrderOnReviewDeliveryDate(order?.deliveryDate);
  }, [order, setOrderOnReviewItems, setOrderOnReviewDeliveryDate]);
};
