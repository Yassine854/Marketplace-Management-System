import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";
import { useOrderActionsFunctions } from "../../hooks/useOrderActionsFunctions";

export const useOrderActionsByStatus = () => {
  const { status } = useOrdersStore();

  const {
    setBackToValid,
    setToUnpaid,
    setToReadyToShip,
    setBackToOpen,
    cancel,
    gotToEdit,
    pickList,
    deliveryNote,
    setToArchived,
    setToDelivered,
    setToValid,
  } = useOrderActionsFunctions();

  const actions = {
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

  return {
    //@ts-ignore
    actions: actions[status],
  };
};
