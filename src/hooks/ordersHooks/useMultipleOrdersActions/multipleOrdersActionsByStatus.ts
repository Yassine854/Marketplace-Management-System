export const multipleOrdersActionsByStatus = ({
  generatePickLists,
  openCancelingModal,
  generateDeliveryNotes,
  selectedOrders,
  editStatusesAndStates,
  navigateToManageMilkRun,
}: any) => {
  const setToValid = {
    name: "Set To Valid",
    key: "1",
    action: () => {
      editStatusesAndStates({
        ordersIds: selectedOrders,
        status: "valid",
        state: "valid",
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
        state: "unpaid",
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
        state: "shipped",
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
        state: "delivered",
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
        state: "archived",
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
        state: "valid",
      });
    },
  };

  const cancel = {
    name: "Cancel",
    key: "8",

    action: async () => {
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
    name: "Generate Delivery Notes",
    key: "10",

    action: () => {
      generateDeliveryNotes(selectedOrders);
    },
  };

  const milkRun = {
    name: "Manage Milk-Runs",
    key: "11",

    action: () => {
      navigateToManageMilkRun();
    },
  };

  return {
    open: [setToValid, cancel, pickList, deliveryNote, milkRun],
    valid: [
      setToReadyToShip,
      setBackToOpen,
      cancel,
      pickList,
      deliveryNote,
      milkRun,
    ],
    shipped: [
      setToUnpaid,
      setBackToValid,
      cancel,
      pickList,
      deliveryNote,
      milkRun,
    ],
    unpaid: [setToDelivered, pickList, deliveryNote, milkRun],
    delivered: [setToArchived, pickList, deliveryNote],
    archived: [pickList, deliveryNote],
    failed: [pickList, deliveryNote],
    closed: [pickList, deliveryNote],
    all: [pickList, deliveryNote],
  };
};
