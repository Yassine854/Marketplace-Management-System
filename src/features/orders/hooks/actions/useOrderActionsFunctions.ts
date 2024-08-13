import { useEffect } from "react";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useOrderMutations } from "../useOrderMutations";
import { useOrderActionsStore } from "@/features/orders/stores/orderActionsStore";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";

export const useOrderActionsFunctions = () => {
  const { navigateToOrderDetails } = useNavigation();

  const {
    editDetails,
    generateSummary,
    generatePickList,
    editStatusAndState,
    generateDeliveryNote,
    isSomeMutationPending,
  } = useOrderMutations();

  const { setIsInEditMode, setOrderOnReviewId } = useOrderDetailsStore();

  const {
    setSelectedAction,
    setOrderToCancelId,
    setIsSomeActionPending,
    setOrderUnderActionId,
  } = useOrderActionsStore();

  useEffect(() => {
    setIsSomeActionPending(isSomeMutationPending);
  }, [isSomeMutationPending, setIsSomeActionPending]);

  const setToValid = {
    key: "setToValid",
    name: "Set To Valid",
    action: (orderId: string): void => {
      setOrderUnderActionId(orderId);
      editStatusAndState({
        orderId,
        status: "valid",
        state: "new",
      });
    },
  };

  const setBackToOpen = {
    key: "setBackToOpen",
    name: "Set Back To Open",
    action: (orderId: string): void => {
      setOrderUnderActionId(orderId);
      editStatusAndState({
        orderId,
        status: "open",
        state: "new",
      });
    },
  };

  const setToUnpaid = {
    key: "setToUnpaid",
    name: "Set To Unpaid",
    action: (orderId: string): void => {
      setOrderUnderActionId(orderId);
      editStatusAndState({
        orderId,
        status: "unpaid",
        state: "complete",
      });
    },
  };

  const setToReadyToShip = {
    key: "setToReadyToShip",
    name: "Set To Ready To Ship",
    action: (orderId: string): void => {
      setOrderUnderActionId(orderId);
      editStatusAndState({
        orderId,
        status: "shipped",
        state: "new",
      });
    },
  };

  const setToDelivered = {
    key: "setToDelivered",
    name: "Set To Delivered",
    action: (orderId: string): void => {
      setOrderUnderActionId(orderId);
      editStatusAndState({
        orderId,
        status: "delivered",
        state: "complete",
      });
    },
  };

  const setToArchived = {
    key: "setToArchived",
    name: "Set To Archived",
    action: (orderId: string): void => {
      setOrderUnderActionId(orderId);
      editStatusAndState({
        orderId,
        status: "archived",
        state: "complete",
      });
    },
  };

  const setBackToValid = {
    key: "setBackToValid",
    name: "Set Back To Valid",
    action: (orderId: string): void => {
      setOrderUnderActionId(orderId);
      editStatusAndState({
        orderId,
        status: "valid",
        state: "new",
      });
    },
  };

  const pickList = {
    key: "pickList",
    name: "Generate Pick List",
    action: (orderId: string): void => {
      setOrderUnderActionId(orderId);
      generatePickList(orderId);
    },
  };

  const summary = {
    key: "summary",
    name: "Generate Summary",
    action: (orderId: string): void => {
      setOrderUnderActionId(orderId);
      generateSummary(orderId);
    },
  };

  const deliveryNote = {
    key: "deliveryNote",
    name: "Generate Delivery Note(BL)",
    action: (orderId: string): void => {
      setOrderUnderActionId(orderId);
      generateDeliveryNote(orderId);
    },
  };

  const cancel = {
    key: "cancel",
    name: "Cancel",
    action: async (orderId: any) => {
      setOrderUnderActionId(orderId);
      setOrderToCancelId(orderId);
    },
  };

  const gotToEdit = {
    key: "gotToEdit",
    name: "Edit",
    action: (orderId: string): void => {
      setSelectedAction(edit);
      navigateToOrderDetails();
      setIsInEditMode(true);
      setOrderUnderActionId(orderId);
      setOrderOnReviewId(orderId);
    },
  };

  const edit = {
    key: "edit",
    name: "Edit",
    action: (orderId: string) => {
      setOrderUnderActionId(orderId);
      editDetails();
    },
  };

  return {
    edit,
    cancel,
    summary,
    pickList,
    gotToEdit,
    setToValid,
    setToUnpaid,
    deliveryNote,
    setToArchived,
    setBackToOpen,
    setToDelivered,
    setBackToValid,
    setToReadyToShip,
  };
};
