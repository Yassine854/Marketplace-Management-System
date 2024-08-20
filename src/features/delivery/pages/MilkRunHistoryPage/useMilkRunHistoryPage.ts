import { useMilkRunStore } from "../../stores/milkRunStore";
import { useNavigation } from "../../../shared/hooks/useNavigation";
import { useGetMilkRunOrders } from "../../hooks/queries/useGetMilkRunOrders";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";

export const useMilkRunHistoryPage = () => {
  const { setDeliveryDate } = useMilkRunStore();

  const { setOrderOnReviewId } = useOrderDetailsStore();

  const { navigateToOrderDetails } = useNavigation();

  const { orders, count: ordersCount, isLoading } = useGetMilkRunOrders();

  const onDetailsClick = (orderId: string): void => {
    setOrderOnReviewId(orderId);
    navigateToOrderDetails();
  };

  return {
    orders,
    isLoading,
    ordersCount,
    onDetailsClick,
    onDeliveryDateChange: setDeliveryDate,
  };
};
