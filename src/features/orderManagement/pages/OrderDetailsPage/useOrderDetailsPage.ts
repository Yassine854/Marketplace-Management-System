import { useEffect, useRef, useState } from "react";
import { useOrderDetailsActions } from "../../hooks/actions/useOrderDetailsActions";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useGetOrder } from "@/features/orderManagement/hooks/queries/useGetOrder";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useCancelOrder } from "../../hooks/mutations/oneOrder/useCancelOrder";
import { useDisclosure } from "@nextui-org/modal";
import { useGetOrderItems } from "../../hooks/queries/useGetOrderItems";
import { redirect } from "next/navigation";
import { useOrderActionsStore } from "../../stores/orderActionsStore";
import { useOrderOnReviewItems } from "../../hooks/useOrderOnReviewItems";
import { useTotal } from "../../hooks/useTotal";

export const useOrderDetailsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { navigateBack } = useNavigation();
  const dropRef = useRef();
  const { orderOnReviewItems, isLoading: isOrderOnReviewItemsLoading } =
    useOrderOnReviewItems();
  const {
    total,
    isInEditMode,
    orderOnReviewId,
    setOrderOnReviewItems,
    setOrderOnReviewDeliveryDate,
    // orderOnReviewItems,
  } = useOrderDetailsStore();

  const { actions, isSomeActionPending, orderToCancelId, setOrderToCancelId } =
    useOrderDetailsActions();
  const {
    onOpen,
    isOpen: isCancelingModalOpen,
    onClose: onCancelingModalClose,
  } = useDisclosure();
  const {
    cancelOrderAsync,
    isPending: isCancelingPending,
    isError,
  } = useCancelOrder();
  useTotal();
  const { data: order, isLoading: isOrderLoading } = useGetOrder();

  // const { data: orderItems, isLoading: isOrderItemsLoading } =
  //   useGetOrderItems(orderOnReviewId);

  const reset = () => {
    //@ts-ignore
    dropRef.current && dropRef.current?.reset();
  };

  useEffect(() => {
    if (!isSomeActionPending) {
      reset();
    }
  }, [isSomeActionPending]);

  //useOrderDetailsEffect(reset);

  const { orderUnderActionId } = useOrderActionsStore();

  useEffect(() => {
    if (!orderUnderActionId) {
      reset();
    }
  }, [orderUnderActionId, reset]);

  useEffect(() => {
    !orderOnReviewId && redirect("/orders");
  }, [orderOnReviewId]);

  useEffect(() => {
    order && setOrderOnReviewDeliveryDate(order?.deliveryDate);
  }, [order, setOrderOnReviewItems, setOrderOnReviewDeliveryDate]);

  useEffect(() => {
    if (orderToCancelId) {
      onOpen();
    } else {
      onCancelingModalClose();
    }
  }, [orderToCancelId, onOpen, onCancelingModalClose]);

  useEffect(() => {
    if (isError) {
      setOrderToCancelId("");
      onCancelingModalClose();
      reset();
    }
  }, [isError]);

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
    isInEditMode,
    orderOnReviewItems,
    onArrowClick: navigateBack,
    cancelOrder: async () => {
      await cancelOrderAsync(orderOnReviewId);
      setOrderToCancelId("");
      onCancelingModalClose();
      reset();
    },
    //@ts-ignore
    actions: actions[order?.status],
    isSomeActionPending,
    onDeliveryDateChange: setOrderOnReviewDeliveryDate,
    isCancelingModalOpen,
    onCancelingModalClose,
    isCancelingPending,
  };
};
