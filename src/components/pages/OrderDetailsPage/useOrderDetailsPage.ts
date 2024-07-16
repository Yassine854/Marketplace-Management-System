import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useOrdersStore } from "@/stores/ordersStore";
import { useOrderActions } from "@/hooks/ordersHooks";
import { useNavigation } from "@/hooks/useNavigation";
import { useGetOrder } from "@/hooks/queries/orderQuries/useGetOrder";

export const useOrderDetailsPage = () => {
  const { navigateBack } = useNavigation();

  const {
    orderOnReviewId,
    orderOnReviewItems,
    setOrderOnReviewItems,
    setOrderOnReviewDeliveryDate,
  } = useOrdersStore();

  const {
    dropRef,
    cancelOrder,
    onOpenChange,
    orderUnderActionId,
    isCancelingPending,
    isCancelingModalOpen,
    editOrderActions: actions,
  } = useOrderActions();

  const { data: order, refetch } = useGetOrder(orderOnReviewId);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let total = 0;
    orderOnReviewItems.forEach((item: any) => {
      total += item.shipped * item.productPrice;
    });

    setTotal(total);
  }, [orderOnReviewItems]);

  useEffect(() => {
    order && setOrderOnReviewItems(order?.items);
    order && setOrderOnReviewDeliveryDate(order?.deliveryDate);
  }, [order, setOrderOnReviewItems, setOrderOnReviewDeliveryDate]);

  useEffect(() => {
    !orderUnderActionId && refetch();
  }, [orderUnderActionId, refetch]);

  useEffect(() => {
    !isCancelingPending && refetch();
  }, [isCancelingPending, refetch]);

  useEffect(() => {
    !orderOnReviewId && redirect("/orders");
  }, [orderOnReviewId]);

  return {
    order,
    total,
    actions,
    dropRef,
    cancelOrder,
    onOpenChange,
    orderUnderActionId,
    orderOnReviewItems,
    isCancelingPending,
    isCancelingModalOpen,
    onArrowClick: navigateBack,
    onDeliveryDateChange: setOrderOnReviewDeliveryDate,
  };
};
