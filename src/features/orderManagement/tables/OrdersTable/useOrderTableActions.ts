import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useOrderActionsStore } from "@/features/orderManagement/stores/orderActionsStore";
import { useOrderActionsByStatus } from "./useOrderActionsByStatus";
import { useOrderActionsFunctions } from "@/features/orderManagement/hooks/useOrderActionsFunctions";

export const useOrderTableActions = () => {
  const { actions } = useOrderActionsByStatus();
  const { summary } = useOrderActionsFunctions();
  const { navigateToOrderDetails } = useNavigation();
  const { setOrderOnReviewId } = useOrderDetailsStore();

  const { setOrderUnderActionId, isSomeActionPending, orderUnderActionId } =
    useOrderActionsStore();

  const onOrderClick = (orderId: string) => {
    navigateToOrderDetails();
    setOrderOnReviewId(orderId);
    setOrderUnderActionId(orderId);
  };

  return {
    summary,
    onOrderClick,
    orderUnderActionId,
    isSomeActionPending,
    actions,
  };
};
