import { useOrderActionsFunctions } from "./useOrderActionsFunctions";
import { useOrderActionsSomeBusinessLogic } from "./useOrderActionsSomeBusinessLogic";

export const useOrderActionsByStatus = (openCancelingModal: any) => {
  const {
    isPending,
    orderToCancelId,
    isEditingPending,
    orderUnderActionId,
    status,
  } = useOrderActionsSomeBusinessLogic();

  const {
    setBackToValid,
    setToUnpaid,
    setToReadyToShip,
    setBackToOpen,
    cancel,
    gotToEdit,
    pickList,
    deliveryNote,
    edit,
    setToArchived,
    setToDelivered,
    setToValid,
  } = useOrderActionsFunctions(openCancelingModal);

  const orderActions = {
    valid: [
      setToReadyToShip,
      setBackToOpen,
      cancel,
      gotToEdit,
      pickList,
      deliveryNote,
    ],
    shipped: [
      setToUnpaid,
      setBackToValid,
      cancel,
      gotToEdit,
      pickList,
      deliveryNote,
    ],
    failed: [pickList, deliveryNote],
    closed: [pickList, deliveryNote],
    archived: [pickList, deliveryNote],
    unpaid: [setToDelivered, pickList, deliveryNote],
    delivered: [setToArchived, pickList, deliveryNote],
    open: [setToValid, cancel, gotToEdit, pickList, deliveryNote],
  };

  const orderDetailsActions = {
    valid: [
      edit,
      setToReadyToShip,
      setBackToOpen,
      cancel,
      pickList,
      deliveryNote,
    ],
    shipped: [
      edit,
      setToUnpaid,
      setBackToValid,
      cancel,
      pickList,
      deliveryNote,
    ],
    failed: [pickList, deliveryNote],
    closed: [pickList, deliveryNote],
    archived: [pickList, deliveryNote],
    unpaid: [setToDelivered, pickList, deliveryNote],
    delivered: [setToArchived, pickList, deliveryNote],
    open: [edit, setToValid, cancel, pickList, deliveryNote],
  };

  return {
    isPending,
    orderToCancelId,
    isEditingPending,
    orderUnderActionId,
    //@ts-ignore
    orderActions: orderActions[status],
    //@ts-ignore
    orderDetailsActions: orderDetailsActions[status],
  };
};
