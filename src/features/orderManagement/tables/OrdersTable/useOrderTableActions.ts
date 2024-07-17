import { useNavigation } from "@/hooks/useNavigation";
import { useOrderDetailsStore } from "@/stores/orderDetailsStore";
import { useOrderActionsStore } from "@/stores/orderActionsStore";
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
