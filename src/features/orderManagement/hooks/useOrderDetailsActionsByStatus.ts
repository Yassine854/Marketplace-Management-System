import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";
import { useOrderActionsFunctions } from "./useOrderActionsFunctions";

export const useOrderDetailsActionsByStatus = () => {
  const { status } = useOrdersStore();

  const {
    edit,
    cancel,
    summary,
    pickList,
    setToValid,
    setToUnpaid,
    deliveryNote,
    setToArchived,
    setBackToOpen,
    setToDelivered,
    setBackToValid,
    setToReadyToShip,
  } = useOrderActionsFunctions();

  const actions = {
    valid: [
      edit,
      setToReadyToShip,
      setBackToOpen,
      cancel,
      pickList,
      deliveryNote,
      summary,
    ],
    shipped: [
      edit,
      setToUnpaid,
      setBackToValid,
      cancel,
      pickList,
      deliveryNote,
      summary,
    ],
    failed: [pickList, deliveryNote, summary],
    closed: [pickList, deliveryNote, summary],
    archived: [pickList, deliveryNote, summary],
    unpaid: [setToDelivered, pickList, deliveryNote, summary],
    delivered: [setToArchived, pickList, deliveryNote, summary],
    open: [edit, setToValid, cancel, pickList, deliveryNote, summary],
  };

  return {
    //@ts-ignore
    actions: actions[status],
  };
};
