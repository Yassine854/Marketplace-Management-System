import { useEffect } from "react";
import { useDisclosure } from "@nextui-org/modal";
import { useCancelOrder } from "../../hooks/mutations/oneOrder/useCancelOrder";
import { useOrderActionsByStatus } from "../../hooks/actions/useOrderActionsByStatus";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useOrderActionsStore } from "@/features/orderManagement/stores/orderActionsStore";
import { useOrderActionsFunctions } from "@/features/orderManagement/hooks/actions/useOrderActionsFunctions";

export const useOrderTableActions = () => {
  const { actions } = useOrderActionsByStatus();
  const { summary } = useOrderActionsFunctions();
  const { navigateToOrderDetails } = useNavigation();
  const { setOrderOnReviewId } = useOrderDetailsStore();

  const { cancelOrderAsync, isPending: isCancelingPending } = useCancelOrder();

  const {
    onOpen,
    isOpen: isCancelingModalOpen,
    onClose: onCancelingModalClose,
  } = useDisclosure();

  const {
    orderToCancelId,
    orderUnderActionId,
    isSomeActionPending,
    setOrderUnderActionId,
    setOrderToCancelId,
  } = useOrderActionsStore();

  const onOrderClick = (orderId: string) => {
    navigateToOrderDetails();
    setOrderOnReviewId(orderId);
    setOrderUnderActionId(orderId);
  };

  const cancelOrder = async () => {
    try {
      await cancelOrderAsync(orderToCancelId);
      setOrderToCancelId("");
      onCancelingModalClose();
    } catch {
      setOrderToCancelId("");
      onCancelingModalClose();
    }
  };

  useEffect(() => {
    if (orderToCancelId) {
      onOpen();
    } else {
      onCancelingModalClose();
    }
  }, [orderToCancelId, onOpen, onCancelingModalClose]);

  return {
    actions,
    summary,
    cancelOrder,
    onOrderClick,
    orderUnderActionId,
    isCancelingPending,
    isSomeActionPending,
    isCancelingModalOpen,
    onCancelingModalClose,
  };
};
