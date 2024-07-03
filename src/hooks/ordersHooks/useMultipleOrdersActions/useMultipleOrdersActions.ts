import { useEffect, useState } from "react";
import { useOrdersStore } from "@/stores/ordersStore";
import { multipleOrdersActionsByStatus } from "./multipleOrdersActionsByStatus";
import { useEditOrdersStatusesAndStates } from "./useEditMultipleOrdersStatusesAndStates";
import { useDisclosure } from "@nextui-org/react";
import { useCancelMultipleOrders } from "./useCancelMultipleOrders";

export const useMultipleOrdersActions = () => {
  const { status, selectedOrders } = useOrdersStore();
  const { editStatusesAndStates, isPending: isEditingPending } =
    useEditOrdersStatusesAndStates();

  const { cancelOrdersAsync, isPending: isCancelingPending } =
    useCancelMultipleOrders();

  const {
    isOpen: isCancelingModalOpen,
    onOpen: openCancelingModal,
    onOpenChange,
    onClose,
  } = useDisclosure();
  const [isPending, setIsPending] = useState(false);

  const cancelOrders = async () => {
    await cancelOrdersAsync(selectedOrders);
    onClose();
  };

  const actions = multipleOrdersActionsByStatus({
    editStatusesAndStates,
    selectedOrders,
    // navigateToManageMilkRun,
    // generateDeliveryNote,
    // generatePickList,
    // editStatusAndState,
    openCancelingModal,
    // setOrderUnderActionId,
    // setOrderToCancelId,
  });

  useEffect(() => {
    if (isEditingPending) {
      setIsPending(true);
    } else {
      setIsPending(false);
    }
  }, [isEditingPending]);

  return {
    //@ts-ignore
    actions: actions[status],
    isPending,
    isCancelingModalOpen,
    openCancelingModal,
    onOpenChange,
    onClose,
    isCancelingPending,
    cancelOrders,
  };
};
