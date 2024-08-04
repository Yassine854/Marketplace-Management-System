import { useEffect } from "react";
import { useDisclosure } from "@nextui-org/modal";
import { useOrderDetailsStore } from "../stores/orderDetailsStore";
import { useCancelOrder } from "./mutations/oneOrder/useCancelOrder";
import { useOrderDetailsActions } from "./actions/useOrderDetailsActions";

export const useCancelOrderFromDetailsPage = () => {
  const { orderOnReviewId } = useOrderDetailsStore();
  const { orderToCancelId } = useOrderDetailsActions();

  const {
    onOpen,
    isOpen: isCancelingModalOpen,
    onClose: onCancelingModalClose,
  } = useDisclosure();

  const {
    isError,
    cancelOrderAsync,
    isPending: isCancelingPending,
  } = useCancelOrder();

  const cancelOrder = async () => {
    await cancelOrderAsync(orderOnReviewId);
    onCancelingModalClose();
  };

  useEffect(() => {
    if (orderToCancelId) {
      onOpen();
    } else {
      onCancelingModalClose();
    }
  }, [orderToCancelId, onOpen, onCancelingModalClose]);

  useEffect(() => {
    if (isError) {
      //  onCancelingModalClose();
    }
  }, [isError]);

  return {
    cancelOrder,
    isCancelingPending,
    isCancelingModalOpen,
    onCancelingModalClose,
  };
};
