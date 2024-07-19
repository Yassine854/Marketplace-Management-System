import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useOrderDetailsEffect } from "./useOrderDetailsEffect";
import { useGetOrder } from "@/features/orderManagement/hooks/queries/useGetOrder";
import { useEffect, useRef } from "react";
import { useOrderDetailsActions } from "./useOrderDetailsActions";

export const useOrderDetailsPage = () => {
  const { navigateBack } = useNavigation();
  const dropRef = useRef();

  const {
    total,
    isInEditMode,
    orderOnReviewId,
    orderOnReviewItems,
    setOrderOnReviewDeliveryDate,
  } = useOrderDetailsStore();

  const { actions, isSomeActionPending } = useOrderDetailsActions();

  const { data: order } = useGetOrder(orderOnReviewId);

  const reset = () => {
    //@ts-ignore
    dropRef.current && dropRef.current?.reset();
  };

  useEffect(() => {
    if (!isSomeActionPending) {
      reset();
    }
  }, [isSomeActionPending]);

  // useOrderDetailsEffect(reset);

  return {
    order,
    total,
    dropRef,
    isInEditMode,
    orderOnReviewItems,
    onArrowClick: navigateBack,
    actions,
    isSomeActionPending,
    onDeliveryDateChange: setOrderOnReviewDeliveryDate,
  };
};
