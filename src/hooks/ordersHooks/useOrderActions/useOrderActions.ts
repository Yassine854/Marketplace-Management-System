import { useRef } from "react";
import { useCancelOrder } from "../../mutations/orderMutations/useCancelOrder";
import { useDisclosure } from "@nextui-org/react";
import { useOrdersStore } from "@/stores/ordersStore";
import { useNavigation } from "@/hooks/useNavigation";
import { useOrderActionsEffect } from "./useOrderActionsEffect";
import { useOrderActionsByStatus } from "./useOrderActionsByStatus";
import { useGenerateOrderSummary } from "../../mutations/orderMutations/useGenerateOrderSummary";

export const useOrderActions = () => {
  const dropRef = useRef();

  const reset = () => {
    //@ts-ignore
    dropRef.current && dropRef.current?.reset();
  };

  const { setOrderOnReviewId, orderUnderActionId, setOrderUnderActionId } =
    useOrdersStore();

  const { navigateToOrderDetails } = useNavigation();

  const onOrderClick = (orderId: string) => {
    navigateToOrderDetails();
    setOrderOnReviewId(orderId);
  };

  const {
    onClose,
    onOpenChange,
    onOpen: openCancelingModal,
    isOpen: isCancelingModalOpen,
  } = useDisclosure();

  const {
    isPending,
    orderActions,
    orderToCancelId,
    isEditingPending,
    orderDetailsActions,
  } = useOrderActionsByStatus(openCancelingModal);

  const { cancelOrder, isPending: isCancelingPending } =
    useCancelOrder(onClose);

  const { generateSummary, pendingOrderId } = useGenerateOrderSummary();

  useOrderActionsEffect({
    reset,
    isPending,
    isEditingPending,
    isCancelingPending,
    setOrderUnderActionId,
  });

  return {
    dropRef,
    cancelOrder,
    onOrderClick,
    onOpenChange,
    pendingOrderId,
    orderToCancelId,
    generateSummary,
    orderUnderActionId,
    isCancelingPending,
    isCancelingModalOpen,
    actions: orderActions,
    editOrderActions: orderDetailsActions,
  };
};
