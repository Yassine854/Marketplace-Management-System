import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useGetOrder } from "@/hooks/ordersHooks/useGetOrder";
import { useOrdersStore } from "@/stores/ordersStore";
import { useOrderActions } from "@/hooks/ordersHooks";
import { useNavigation } from "@/hooks/useNavigation";

export const useOrderDetailsPage = () => {
  const { navigateToOrders } = useNavigation();

  const {
    setOrderOnReviewItems,
    orderOnReviewItems,
    orderOnReviewId,
    setOrderOnReviewDeliveryDate,
  } = useOrdersStore();

  const {
    editOrderActions: actions,
    orderUnderActionId,
    cancelOrder,
    isCancelingModalOpen,
    onOpenChange,
    isCancelingPending,
    dropRef,
  } = useOrderActions();

  const { data: order, refetch } = useGetOrder(orderOnReviewId);

  const [total, setTotal] = useState(0);

  const onArrowClick = () => {
    navigateToOrders();
  };

  const onDeliveryDateChange = (value: any) => {
    setOrderOnReviewDeliveryDate(value);
  };

  useEffect(() => {
    let total = 0;
    orderOnReviewItems.forEach((item: any) => {
      total += item.shipped * item.productPrice;
    });

    setTotal(total);
  }, [orderOnReviewItems]);

  useEffect(() => {
    if (order) {
      setOrderOnReviewItems(order?.items);
      setOrderOnReviewDeliveryDate(order?.deliveryDate);
    }
  }, [order, setOrderOnReviewItems, setOrderOnReviewDeliveryDate]);

  useEffect(() => {
    !orderUnderActionId && refetch();
  }, [orderUnderActionId, refetch]);

  useEffect(() => {
    !isCancelingPending && refetch();
  }, [isCancelingPending, refetch]);

  useEffect(() => {
    if (!orderOnReviewId) {
      redirect("/orders");
    }
  }, [orderOnReviewId]);

  return {
    order,
    total,
    orderUnderActionId,
    dropRef,
    orderOnReviewItems,
    cancelOrder,
    isCancelingModalOpen,
    onOpenChange,
    isCancelingPending,
    onDeliveryDateChange,
    onArrowClick,
    actions,
  };
};
