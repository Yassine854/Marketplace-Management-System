import { useTotal } from "../../hooks/useTotal";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useOrderActionsStore } from "../../stores/orderActionsStore";
import { useOrderDetailsEffect } from "../../hooks/useOrderDetailsEffect";
import { useGetOrder } from "@/features/orderManagement/hooks/queries/useGetOrder";
import { useOrderDetailsActions } from "../../hooks/actions/useOrderDetailsActions";
import { useCancelOrderFromDetailsPage } from "../../hooks/useCancelOrderFromDetailsPage";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useOrderOnReviewItems } from "../../hooks/useOrderOnReviewItems/useOrderOnReviewItems";

export const useOrderDetailsPage = () => {
  useTotal();

  useOrderDetailsEffect();

  const dropRef = useRef();

  const { navigateBack } = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const { orderUnderActionId } = useOrderActionsStore();

  const { total, isInEditMode, setOrderOnReviewDeliveryDate, orderOnReviewId } =
    useOrderDetailsStore();

  const { order, isLoading: isOrderLoading } = useGetOrder(orderOnReviewId);

  const { actions, isSomeActionPending } = useOrderDetailsActions();

  const { orderOnReviewItems, isLoading: isOrderOnReviewItemsLoading } =
    useOrderOnReviewItems();

  const {
    cancelOrder,
    isCancelingPending,
    isCancelingModalOpen,
    onCancelingModalClose,
  } = useCancelOrderFromDetailsPage();

  const reset = useCallback(() => {
    //@ts-ignore
    dropRef.current && dropRef.current?.reset();
  }, []);

  useEffect(() => {
    if (!orderUnderActionId) {
      reset();
    }
  }, [orderUnderActionId, reset]);

  useEffect(() => {
    order && setOrderOnReviewDeliveryDate(order?.deliveryDate);
  }, [order, setOrderOnReviewDeliveryDate]);

  useEffect(() => {
    if (isOrderLoading || isOrderOnReviewItemsLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isOrderLoading, isOrderOnReviewItemsLoading]);

  return {
    order,
    total,
    dropRef,
    isLoading,
    cancelOrder,
    isInEditMode,
    orderOnReviewItems,
    isCancelingPending,
    isSomeActionPending,
    isCancelingModalOpen,
    onCancelingModalClose,
    onArrowClick: navigateBack,
    //@ts-ignore
    actions: actions[order?.status],
    onDeliveryDateChange: setOrderOnReviewDeliveryDate,
  };
};
