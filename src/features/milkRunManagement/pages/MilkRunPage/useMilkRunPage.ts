import { toast } from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { useMilkRunStore } from "../../stores/milkRunStore";
import { useNavigation } from "../../../shared/hooks/useNavigation";
import { useGetMilkRunOrders } from "../../hooks/queries/useGetMilkRunOrders";
import { useGetDeliveryAgents } from "../../hooks/queries/useGetDeliveryAgents";
import { useEditOrdersMilkRun } from "../../hooks/mutations/useEditOrdersMilkRun";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";

//To Refactor
export const useMilkRunPage = () => {
  const {
    reset,
    deliverySlot,
    deliveryDate,
    deliveryAgentId,
    setDeliveryDate,
    setDeliverySlot,
    selectedOrdersIds,
    deliveryAgentName,
    setDeliveryAgentId,
    setSelectedOrdersIds,
    setDeliveryAgentName,
  } = useMilkRunStore();

  const { setOrderOnReviewId } = useOrdersStore();

  const { navigateToOrderDetails } = useNavigation();

  const { deliveryAgents, isLoading: isDeliveryAgentsLoading } =
    useGetDeliveryAgents();

  const {
    orders,
    count: ordersCount,
    isLoading: isOrdersLoading,
  } = useGetMilkRunOrders(Number(deliveryDate));

  const { editOrdersMilkRun, isPending } = useEditOrdersMilkRun();

  const [isLoading, setIsLoading] = useState(false);

  const deliveryAgentSelectorRef = useRef(null);

  const deliverySlotSelectorRef = useRef(null);

  const onOrderMarkerClick = (orderId: string): void => {
    let list = selectedOrdersIds;

    const index = list.indexOf(orderId);

    index !== -1 ? list.splice(index, 1) : list.push(orderId);

    setSelectedOrdersIds(list);
  };

  const onEditClick = (orderId: string): void => {
    setOrderOnReviewId(orderId);
    navigateToOrderDetails();
  };

  const onDeliveryAgentChange = ({ name, id }: any) => {
    setDeliveryAgentName(name);
    setDeliveryAgentId(id);
  };

  const onReset = () => {
    toast.success("test");
    reset();
    //@ts-ignore
    deliveryAgentSelectorRef?.current?.reset();
    //@ts-ignore
    deliverySlotSelectorRef?.current?.reset();
  };

  const onValidate = (): void => {
    if (!selectedOrdersIds?.length) {
      toast.error("Please Select some Orders", { duration: 3000 });
      return;
    }

    if (!deliveryAgentId) {
      toast.error("Please Select Delivery Agent", { duration: 3000 });
      return;
    }

    if (!deliverySlot) {
      toast.error("Please Select Delivery Slot", { duration: 3000 });
      return;
    }

    editOrdersMilkRun({
      ordersIds: selectedOrdersIds,
      deliverySlot,
      deliveryAgentName,
      deliveryAgentId,
    });

    onReset();
  };

  useEffect(() => {
    if (isDeliveryAgentsLoading || isOrdersLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isDeliveryAgentsLoading, isOrdersLoading, setIsLoading]);

  return {
    orders,
    onReset,
    isLoading,
    onValidate,
    onEditClick,
    ordersCount,
    deliveryAgents,
    selectedOrdersIds,
    onOrderMarkerClick,
    onDeliveryAgentChange,
    deliverySlotSelectorRef,
    deliveryAgentSelectorRef,
    onMilkRunChange: setDeliverySlot,
    onDeliveryDateChange: setDeliveryDate,
  };
};
