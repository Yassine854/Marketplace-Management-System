export const orderActionsByStatus = ({
  navigateToManageMilkRun,
  navigateToOrderDetails,
  generateDeliveryNote,
  generatePickList,
  editStatusAndState,
  openCancelingModal,
  setOrderUnderActionId,
  setOrderToCancelId,
  setOrderOnReviewId,
}: any) => {
  const setToValid = {
    name: "Set To Valid",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId);
      editStatusAndState({ orderId, status: "valid", state: "valid" });
    },
  };
  const setBackToOpen = {
    name: "Set Back To Open ",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId);
      editStatusAndState({ orderId, status: "open", state: "new" });
    },
  };
  const setToUnpaid = {
    name: "Set  To Unpaid ",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId);
      editStatusAndState({ orderId, status: "unpaid", state: "unpaid" });
    },
  };

  const setToReadyToShip = {
    name: "Set To Ready To Ship ",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId);
      editStatusAndState({ orderId, status: "shipped", state: "shipped" });
    },
  };

  const setToDelivered = {
    name: "Set To Delivered ",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId);
      editStatusAndState({ orderId, status: "delivered", state: "delivered" });
    },
  };

  const setToArchived = {
    name: "Set To Archived ",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId);
      editStatusAndState({
        orderId,
        status: "archived",
        state: "archived",
      });
    },
  };

  const setBackToValid = {
    name: "Set Back To Valid ",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId);
      editStatusAndState({ orderId, status: "valid", state: "valid" });
    },
  };

  const cancel = {
    name: "Cancel",
    action: async (orderId: any) => {
      setOrderToCancelId(orderId);
      openCancelingModal();
    },
  };

  const edit = {
    name: "Edit",
    action: (orderId: any) => {
      setOrderOnReviewId(orderId);
      navigateToOrderDetails();
    },
  };

  const pickList = {
    name: "Generate Pick List",
    action: (orderId: string) => {
      setOrderUnderActionId(orderId);
      generatePickList(orderId);
    },
  };

  const deliveryNote = {
    name: "Generate Delivery Note",
    action: (orderId: string) => {
      setOrderUnderActionId(orderId);
      generateDeliveryNote(orderId);
    },
  };

  const milkRun = {
    name: "Manage Milk-Runs",
    action: (orderId: string) => {
      setOrderUnderActionId(orderId);
      navigateToManageMilkRun();
    },
  };

  return {
    open: [setToValid, cancel, edit, pickList, deliveryNote, milkRun],
    valid: [
      setToReadyToShip,
      setBackToOpen,
      cancel,
      edit,
      pickList,
      deliveryNote,
      milkRun,
    ],
    shipped: [
      setToUnpaid,
      setBackToValid,
      cancel,
      edit,
      pickList,
      deliveryNote,
      milkRun,
    ],
    unpaid: [setToDelivered, pickList, deliveryNote, milkRun],
    delivered: [setToArchived, pickList, deliveryNote],
    archived: [pickList, deliveryNote],
    failed: [pickList, deliveryNote],
    closed: [pickList, deliveryNote],
  };
};
