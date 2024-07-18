import { toast } from "react-hot-toast";
import { useNavigation } from "../../../hooks/useNavigation";
import { useEffect, useState, useRef } from "react";
import { useOrdersStore } from "@/stores/ordersStore";
import { useMilkRunStore } from "@/stores/milkRunStore";
import { useGetMilkRunOrders } from "./queries/useGetMilkRunOrders";
import { useGetDeliveryAgents } from "./queries/useGetDeliveryAgents";
import { useEditOrdersMilkRun } from "./mutations/useEditOrdersMilkRun";

export const useMilkRun = () => {
  const {
    reset,
    deliverySlot,
    deliveryDate,
    deliveryAgentId,
    setDeliveryDate,
    setDeliverySlot,
    selectedOrdersIds,
    setDeliveryAgentId,
    setSelectedOrdersIds,
    setDeliveryAgentName,
    deliveryAgentName,
  } = useMilkRunStore();

  const { setOrderOnReviewId } = useOrdersStore();

  const { navigateToOrderDetails } = useNavigation();

  const { deliveryAgents, isLoading: isDeliveryAgentsLoading } =
    useGetDeliveryAgents();

  const {
    orders,
    isLoading: isOrdersLoading,
    isError,
  } = useGetMilkRunOrders(deliveryDate);

  useEffect(() => {
    console.log("🚀 ~ useMilkRun ~ orders:", orders);
  }, [orders]);

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
    isError,
    isLoading,
    onValidate,
    onEditClick,
    deliveryDate,
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
