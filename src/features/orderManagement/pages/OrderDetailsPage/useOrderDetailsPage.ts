import { useTotal } from "../../hooks/useTotal";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useOrderActionsStore } from "../../stores/orderActionsStore";
import { useOrderDetailsEffect } from "../../hooks/useOrderDetailsEffect";
import { useOrderOnReviewItems } from "../../hooks/useOrderOnReviewItems";
import { useGetOrder } from "@/features/orderManagement/hooks/queries/useGetOrder";
import { useOrderDetailsActions } from "../../hooks/actions/useOrderDetailsActions";
import { useCancelOrderFromDetailsPage } from "../../hooks/useCancelOrderFromDetailsPage";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";

export const useOrderDetailsPage = () => {
  useTotal();

  useOrderDetailsEffect();

  const dropRef = useRef();

  const { navigateBack } = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const { orderUnderActionId } = useOrderActionsStore();

  const { data: order, isLoading: isOrderLoading } = useGetOrder();

  const { actions, isSomeActionPending } = useOrderDetailsActions();

  const { orderOnReviewItems, isLoading: isOrderOnReviewItemsLoading } =
    useOrderOnReviewItems();

  const {
    total,
    isInEditMode,
    setOrderOnReviewItems,
    setOrderOnReviewDeliveryDate,
  } = useOrderDetailsStore();

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
  }, [order, setOrderOnReviewItems, setOrderOnReviewDeliveryDate]);

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
