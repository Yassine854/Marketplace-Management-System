//TO-REFACTOR
import { useEffect, useMemo, useState } from "react";
import { onOrderClick } from "./onOrderClick";
import { useGenerateMultiplePickLists } from "./useGenerateMultiplePickLists";
import { useGeneratePickList } from "./useGeneratePickList";
import { useOrdersStore } from "@/stores/ordersStore";
import { useGenerateDeliveryNote } from "./useGenerateDeliveryNote";
import { useNavigation } from "@/hooks/useNavigation";
import { onCancelMultipleOrdersClick } from "./onCancelMultipleOrdersClick";
import { useCancelOrder } from "./useCancelOrder";
import { useOrdersData } from "../useOrdersData";
import { useEditOrderStatusAndState } from "./useEditOrderStatusAndState";
import { useDisclosure } from "@nextui-org/react";

export const useOrderActions = () => {
  const [orderToCancelId, setOrderToCancelId] = useState("");
  const [rowActions, setRowActions] = useState([]);
  const [pendingOrderId, setPendingOrderId] = useState<string>("");
  const [orderUnderActionId, setOrderUnderActionId] = useState<string>("59722");
  const {
    isOpen: isCancelingModalOpen,
    onOpen: openCancelingModal,
    onOpenChange,
    onClose,
  } = useDisclosure();

  const { navigateToOrderDetails, navigateToManageMilkRun } = useNavigation();
  const { status } = useOrdersStore();
  const { refetch } = useOrdersData();

  const { generateDeliveryNote, isPending: isGenerateDeliveryNotePending } =
    useGenerateDeliveryNote();

  const [isPending, setIsPending] = useState<any>(null);
  const [toolbarActions, setToolbarActions] = useState<any[]>([]);

  const { generatePickList, isPending: isGeneratePickListPending } =
    useGeneratePickList();
  const { editStatusAndState, isPending: isEditingPending } =
    useEditOrderStatusAndState();

  const {
    cancelOrder,
    isPending: isCancelingPending,
    cancelOrderAsync,
  } = useCancelOrder();

  const handleOrderCanceling = async () => {
    await cancelOrderAsync(orderToCancelId);

    onClose();
  };
  useEffect(() => {
    if (!isEditingPending && !isCancelingPending) {
      //  setOrderUnderActionId("");
      refetch();
    }
    if (!isGeneratePickListPending && !isGenerateDeliveryNotePending) {
      setOrderUnderActionId("");
    }
  }, [
    isEditingPending,
    refetch,
    setOrderUnderActionId,
    isGeneratePickListPending,
    isCancelingPending,
    isGenerateDeliveryNotePending,
  ]);

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
      editStatusAndState({ orderId, status: "open", state: "new" });
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
      // setOrderUnderActionId(orderId);
      // cancelOrder(orderId);
    },
  };

  const edit = {
    name: "Edit",
    action: (orderId: any) => {
      setOrderUnderActionId(orderId);
      openCancelingModal();
      // setOrderUnderActionId(orderId);
      //navigateToOrderDetails();
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
  const rowActionsList = {
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
    delivered: [setToArchived, pickList, deliveryNote, milkRun],
    archived: [pickList, deliveryNote, milkRun],
    failed: [pickList, deliveryNote, milkRun],
    closed: [pickList, deliveryNote, milkRun],
  };

  useEffect(() => {
    console.log("🚀 ~ useOrdersActions ~ status:", status);

    status
      ? //@ts-ignore
        setRowActions(rowActionsList[status])
      : //@ts-ignore
        setRowActions([pickList, deliveryNote, milkRun]);
  }, [status, setRowActions]);

  return {
    onOrderClick,
    cancelOrder,
    isCancelingModalOpen,
    rowActions,
    toolbarActions,
    isPending,
    pendingOrderId,
    orderUnderActionId,
    onOpenChange,
    handleOrderCanceling,
    isCancelingPending,
    orderToCancelId,
  };
};
