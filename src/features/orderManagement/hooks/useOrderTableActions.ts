import { useEffect } from "react";
import { useOrdersCount, useOrdersData } from ".";
import { useDisclosure } from "@nextui-org/modal";
import { useCancelOrder } from "./mutations/useCancelOrder";
import { useOrderActionsByStatus } from "./useOrderActionsByStatus";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useOrderActionsStore } from "@/features/orderManagement/stores/orderActionsStore";
import { useOrderActionsFunctions } from "@/features/orderManagement/hooks/useOrderActionsFunctions";

export const useOrderTableActions = () => {
  const { refetch } = useOrdersData();
  const { actions } = useOrderActionsByStatus();
  const { summary } = useOrderActionsFunctions();
  const { navigateToOrderDetails } = useNavigation();
  const { refetch: refetchCount } = useOrdersCount();
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
  } = useOrderActionsStore();

  const onOrderClick = (orderId: string) => {
    navigateToOrderDetails();
    setOrderOnReviewId(orderId);
    setOrderUnderActionId(orderId);
  };

  useEffect(() => {
    if (!isSomeActionPending) {
      refetch();
      refetchCount();
    }
  }, [isSomeActionPending, refetch, refetchCount]);

  useEffect(() => {
    orderToCancelId && onOpen();
  }, [orderToCancelId, onOpen]);

  return {
    actions,
    summary,
    cancelOrder: async () => {
      await cancelOrderAsync(orderToCancelId);
      onCancelingModalClose();
    },
    onOrderClick,
    orderUnderActionId,
    isCancelingPending,
    isSomeActionPending,
    isCancelingModalOpen,
    onCancelingModalClose,
  };
};
