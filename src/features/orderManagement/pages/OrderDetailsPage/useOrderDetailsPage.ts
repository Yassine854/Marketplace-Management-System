import { useOrderDetailsEffect } from "../../hooks/useOrderDetailsEffect";
import { useEffect, useRef, useState } from "react";
import { useOrderDetailsActions } from "../../hooks/actions/useOrderDetailsActions";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useGetOrder } from "@/features/orderManagement/hooks/queries/useGetOrder";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useCancelOrder } from "../../hooks/mutations/oneOrder/useCancelOrder";
import { useDisclosure } from "@nextui-org/modal";
import { useGetOrderItems } from "../../hooks/queries/useGetOrderItems";

export const useOrderDetailsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { navigateBack } = useNavigation();
  const dropRef = useRef();

  const {
    total,
    isInEditMode,
    orderOnReviewId,
    orderOnReviewItems,
    setOrderOnReviewDeliveryDate,
    setOrderOnReviewItems,
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

  const { data: order, isLoading: isOrderLoading } = useGetOrder();

  const { data: orderItems, isLoading: isOrderItemsLoading } =
    useGetOrderItems(orderOnReviewId);

  const reset = () => {
    //@ts-ignore
    dropRef.current && dropRef.current?.reset();
  };

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
    if (order && orderItems) {
      const mergedItems = order?.items.map((item: any) => {
        const product = orderItems?.find(
          (p: any) => p.id === parseInt(item.productId),
        );

        return { ...item, ...product };
      });

      setOrderOnReviewItems(mergedItems);
    }
  }, [order, orderItems, setOrderOnReviewItems]);

  useEffect(() => {
    if (isOrderItemsLoading || isOrderItemsLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isOrderLoading, isOrderItemsLoading]);

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
