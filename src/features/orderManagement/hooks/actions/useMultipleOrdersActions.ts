import { useDisclosure } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useCancelMultipleOrders } from "../mutations/multipleOrders/useCancelMultipleOrders";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";
import { useMultipleOrdersActionsByStatus } from "./useMultipleOrdersActionsByStatus";
import { useGenerateMultiplePickLists } from "../mutations/multipleOrders/useGenerateMultiplePickLists";
import { useGenerateMultipleDeliveryNotes } from "../mutations/multipleOrders/useGenerateMultipleDeliveryNotes";
import { useEditOrdersStatusesAndStates } from "../mutations/multipleOrders/useEditMultipleOrdersStatusesAndStates";

export const useMultipleOrdersActions = () => {
  const actionsRef = useRef(null);
  const [isPending, setIsPending] = useState(false);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const { status, selectedOrders } = useOrdersStore();

  const { cancelOrdersAsync, isPending: isCancelingPending } =
    useCancelMultipleOrders();

  const { editStatusesAndStates, isPending: isEditingPending } =
    useEditOrdersStatusesAndStates();

  const { generatePickLists, isPending: isGeneratingPickListPending } =
    useGenerateMultiplePickLists();

  const { generateDeliveryNotes, isPending: isGenerateDeliveryNotePending } =
    useGenerateMultipleDeliveryNotes();

  const cancelOrders = async () => {
    await cancelOrdersAsync(selectedOrders);
    onClose();
  };

  const reset = () => {
    //@ts-ignore
    actionsRef.current && actionsRef.current.reset();
  };

  const actions = useMultipleOrdersActionsByStatus({
    selectedOrders,
    generatePickLists,
    generateDeliveryNotes,
    editStatusesAndStates,
    openCancelingModal: onOpen,
  });

  useEffect(() => {
    if (
      isEditingPending ||
      isGeneratingPickListPending ||
      isGenerateDeliveryNotePending
    ) {
      setIsPending(true);
    } else {
      setIsPending(false);
      reset();
    }
  }, [
    isEditingPending,
    isGeneratingPickListPending,
    isGenerateDeliveryNotePending,
  ]);

  useEffect(() => {
    !isCancelingPending && reset();
  }, [isCancelingPending]);

  return {
    isPending,
    actionsRef,
    cancelOrders,
    generatePickLists,
    isCancelingPending,
    isCancelingModalOpen: isOpen,
    onCancelingModalClose: onClose,
    //@ts-ignore
    actions: status ? actions[status] : actions["all"],
  };
};
