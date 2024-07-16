import { useNavigation } from "@/hooks/useNavigation";
import { useOrderActionsSomeBusinessLogic } from "./useOrderActionsSomeBusinessLogic";

export const useOrderActionsFunctions = (openCancelingModal: any) => {
  const {
    editDetails,
    orderOnReviewId,
    generatePickList,
    setOrderOnReviewId,
    orderOnReviewItems,
    editStatusAndState,
    setOrderToCancelId,
    generateDeliveryNote,
    setOrderUnderActionId,
    orderOnReviewDeliveryDate,
  } = useOrderActionsSomeBusinessLogic();

  const { navigateToOrderDetails } = useNavigation();

  const setToValid = {
    key: "setToValid",
    name: "Set To Valid",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId || "123");
      editStatusAndState({ orderId, status: "valid", state: "valid" });
    },
  };

  const setBackToOpen = {
    key: "setBackToOpen",
    name: "Set Back To Open",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId || "123");
      editStatusAndState({ orderId, status: "open", state: "new" });
    },
  };

  const setToUnpaid = {
    key: "setToUnpaid",
    name: "Set To Unpaid",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId || "123");
      editStatusAndState({ orderId, status: "unpaid", state: "unpaid" });
    },
  };

  const setToReadyToShip = {
    key: "setToReadyToShip",
    name: "Set To Ready To Ship",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId || "123");
      editStatusAndState({ orderId, status: "shipped", state: "shipped" });
    },
  };

  const setToDelivered = {
    key: "setToDelivered",
    name: "Set To Delivered",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId || "123");
      editStatusAndState({ orderId, status: "delivered", state: "delivered" });
    },
  };

  const setToArchived = {
    key: "setToArchived",
    name: "Set To Archived",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId || "123");
      editStatusAndState({
        orderId,
        status: "archived",
        state: "archived",
      });
    },
  };

  const setBackToValid = {
    key: "setBackToValid",
    name: "Set Back To Valid",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId || "123");
      editStatusAndState({ orderId, status: "valid", state: "valid" });
    },
  };

  const cancel = {
    key: "cancel",
    name: "Cancel",
    action: async (orderId: any) => {
      setOrderToCancelId(orderId);
      openCancelingModal();
    },
  };

  const edit = {
    key: "edit",
    name: "Edit",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId || "123");
      editDetails({
        orderId: orderOnReviewId,
        items: orderOnReviewItems,
        deliveryDate: orderOnReviewDeliveryDate,
      });
    },
  };

  const gotToEdit = {
    key: "gotToEdit",
    name: "Go To Edit",
    action: (orderId: any) => {
      setOrderOnReviewId(orderId);
      navigateToOrderDetails();
    },
  };

  const pickList = {
    key: "pickList",
    name: "Generate Pick List",
    action: (orderId: string) => {
      setOrderUnderActionId(orderId || "123");
      generatePickList(orderId);
    },
  };

  const deliveryNote = {
    key: "deliveryNote",
    name: "Generate Delivery Note",
    action: (orderId: string) => {
      setOrderUnderActionId(orderId || "123");
      generateDeliveryNote(orderId);
    },
  };

  return {
    edit,
    cancel,
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
