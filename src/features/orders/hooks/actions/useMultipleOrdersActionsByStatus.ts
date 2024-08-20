export const useMultipleOrdersActionsByStatus = ({
  selectedOrders,
  generatePickLists,
  openCancelingModal,
  generateDeliveryNotes,
  editStatusesAndStates,
}: any) => {
  const setToValid = {
    name: "Set To Valid",
    key: "1",
    action: () => {
      editStatusesAndStates({
        ordersIds: selectedOrders,
        status: "valid",
        state: "new",
      });
    },
  };
  const setBackToOpen = {
    name: "Set Back To Open ",
    key: "2",

    action: () => {
      editStatusesAndStates({
        ordersIds: selectedOrders,
        status: "open",
        state: "new",
      });
    },
  };
  const setToUnpaid = {
    name: "Set  To Unpaid ",
    key: "3",

    action: () => {
      editStatusesAndStates({
        ordersIds: selectedOrders,
        status: "unpaid",
        state: "complete",
      });
    },
  };

  const setToReadyToShip = {
    name: "Set To Ready To Ship ",
    key: "4",

    action: () => {
      editStatusesAndStates({
        ordersIds: selectedOrders,
        status: "shipped",
        state: "new",
      });
    },
  };

  const setToDelivered = {
    name: "Set To Delivered ",
    key: "5",

    action: () => {
      editStatusesAndStates({
        ordersIds: selectedOrders,
        status: "delivered",
        state: "complete",
      });
    },
  };

  const setToArchived = {
    name: "Set To Archived ",
    key: "6",

    action: () => {
      editStatusesAndStates({
        ordersIds: selectedOrders,
        status: "archived",
        state: "complete",
      });
    },
  };

  const setBackToValid = {
    name: "Set Back To Valid ",
    key: "7",

    action: () => {
      editStatusesAndStates({
        ordersIds: selectedOrders,
        status: "valid",
        state: "new",
      });
    },
  };

  const cancel = {
    name: "Cancel",
    key: "8",

    action: () => {
      openCancelingModal();
    },
  };

  const pickList = {
    name: "Generate Pick Lists",
    key: "9",

    action: () => {
      generatePickLists(selectedOrders);
    },
  };

  const deliveryNote = {
    name: "Generate Delivery Notes (BL)",
    key: "10",

    action: () => {
      generateDeliveryNotes(selectedOrders);
    },
  };

  return {
    all: [pickList, deliveryNote],
    failed: [pickList, deliveryNote],
    closed: [pickList, deliveryNote],
    archived: [pickList, deliveryNote],
    unpaid: [setToDelivered, pickList, deliveryNote],
    delivered: [setToArchived, pickList, deliveryNote],
    open: [setToValid, cancel, pickList, deliveryNote],
    shipped: [setToUnpaid, setBackToValid, cancel, pickList, deliveryNote],
    valid: [setToReadyToShip, setBackToOpen, cancel, pickList, deliveryNote],
  };
};
