import { useEffect, useRef, useState } from "react";
import { useGeneratePickList } from "./useGeneratePickList";
import { useOrdersStore } from "@/stores/ordersStore";
import { useGenerateDeliveryNote } from "./useGenerateDeliveryNote";
import { useNavigation } from "@/hooks/useNavigation";
import { useCancelOrder } from "./useCancelOrder";
import { useOrdersData } from "../useOrdersData";
import { useEditOrderStatusAndState } from "./useEditOrderStatusAndState";
import { useDisclosure } from "@nextui-org/react";
import { orderActionsByStatus } from "./orderActionsByStatus";
import { useOrdersCount } from "../useOrdersCount";
import { useGenerateOrderSummary } from "./useGenerateOrderSummary";

export const useOrderActions = () => {
  const dropRef = useRef();

  const reset = () => {
    //@ts-ignore
    dropRef.current && dropRef.current?.reset();
  };

  const {
    isOpen: isCancelingModalOpen,
    onOpen: openCancelingModal,
    onOpenChange,
    onClose,
  } = useDisclosure();

  const { status, setOrderOnReviewId } = useOrdersStore();

  const { refetch } = useOrdersData();

  const { refetch: refetchCount } = useOrdersCount();

  const { navigateToOrderDetails, navigateToManageMilkRun } = useNavigation();

  const { generateSummary, pendingOrderId } = useGenerateOrderSummary();

  const { generateDeliveryNote, isPending: isGenerateDeliveryNotePending } =
    useGenerateDeliveryNote();

  const { generatePickList, isPending: isGeneratePickListPending } =
    useGeneratePickList();

  const { cancelOrder, isPending: isCancelingPending } =
    useCancelOrder(onClose);

  const { editStatusAndState, isPending: isEditingPending } =
    useEditOrderStatusAndState();

  const [orderToCancelId, setOrderToCancelId] = useState("");
  const [orderUnderActionId, setOrderUnderActionId] = useState<string>("");

  const onOrderClick = (orderId: string) => {
    setOrderOnReviewId(orderId);

    navigateToOrderDetails();
  };

  const { orderActions, orderDetailsPageActions } = orderActionsByStatus({
    navigateToManageMilkRun,
    navigateToOrderDetails,
    generateDeliveryNote,
    generatePickList,
    editStatusAndState,
    openCancelingModal,
    setOrderUnderActionId,
    setOrderToCancelId,
    setOrderOnReviewId,
  });

  useEffect(() => {
    if (!isEditingPending && !isCancelingPending) {
      refetch();
      refetchCount();
      reset();
    }
  }, [
    isEditingPending,
    setOrderUnderActionId,
    isCancelingPending,
    refetchCount,
    refetch,
  ]);

  useEffect(() => {
    if (
      !isGeneratePickListPending &&
      !isGenerateDeliveryNotePending &&
      !isEditingPending &&
      !isCancelingPending
    ) {
      setOrderUnderActionId("");
    }
  }, [
    isGeneratePickListPending,
    isGenerateDeliveryNotePending,
    isEditingPending,
    setOrderUnderActionId,
    isCancelingPending,
    refetchCount,
    refetch,
  ]);

  return {
    //@ts-ignore
    actions: orderActions[status],
    //@ts-ignore
    editOrderActions: orderDetailsPageActions,
    onOrderClick,
    cancelOrder,
    isCancelingModalOpen,
    orderUnderActionId,
    onOpenChange,
    isCancelingPending,
    orderToCancelId,
    generateSummary,
    dropRef,
    pendingOrderId,
  };
};
