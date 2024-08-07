import { useMilkRunStore } from "../../stores/milkRunStore";
import { useNavigation } from "../../../shared/hooks/useNavigation";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useGetMilkRunOrders } from "../../hooks/queries/useGetMilkRunOrders";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";

export const useMilkRunHistoryPage = () => {
  const { deliveryDate, setDeliveryDate } = useMilkRunStore();

  const { storeId } = useGlobalStore();

  const { setOrderOnReviewId } = useOrderDetailsStore();

  const { navigateToOrderDetails } = useNavigation();

  const {
    orders,
    count: ordersCount,
    isLoading,
  } = useGetMilkRunOrders({
    deliveryDate,
    storeId,
  });

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
