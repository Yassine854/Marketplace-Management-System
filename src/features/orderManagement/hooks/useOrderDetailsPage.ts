import { useOrderDetailsEffect } from "./useOrderDetailsEffect";
import { useEffect, useRef } from "react";
import { useOrderDetailsActions } from "./useOrderDetailsActions";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useGetOrder } from "@/features/orderManagement/hooks/queries/useGetOrder";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useCancelOrder } from "./mutations/useCancelOrder";
import { useDisclosure } from "@nextui-org/modal";

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

  const { data: order } = useGetOrder(orderOnReviewId);

  const reset = () => {
    //@ts-ignore
    dropRef.current && dropRef.current?.reset();
  };

  const { refetch } = useGetOrder(orderOnReviewId);

  useEffect(() => {
    if (!isSomeActionPending) {
      reset();
    }
  }, [isSomeActionPending]);

  useOrderDetailsEffect(reset);

  useEffect(() => {
    if (orderToCancelId) {
      onOpen();
    } else {
      onCancelingModalClose();
      refetch();
    }
  }, [orderToCancelId, onOpen, onCancelingModalClose]);

  useEffect(() => {
    if (isError) {
      setOrderToCancelId("");
      onCancelingModalClose();
      reset();
    }
  }, [isError]);

  return {
    order,
    total,
    dropRef,
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
