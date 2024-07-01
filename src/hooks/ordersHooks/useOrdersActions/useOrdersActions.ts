import { useState } from "react";
import { onPDFIconClick } from "./onPDFIconClick";
import { onOrderClick } from "./onOrderClick";
import { onGeneratePickListsClick } from "./onGeneratePickListsClick";
import { useOrdersStore } from "@/stores/ordersStore";
import { onGenerateDeliveryNotesClick } from "./onGenerateDeliveryNotesClick";
import { useNavigation } from "@/hooks/useNavigation";
import { onCancelMultipleOrdersClick } from "./onCancelMultipleOrdersClick";
import { onCancelOrderClick } from "./onCancelOrderClick";
import { useOrdersData } from "../useOrdersData";

export const useOrdersActions = () => {
  const { navigateToOrderDetails, navigateToManageMilkRun } = useNavigation();
  const { selectedOrders } = useOrdersStore();
  const { refetch } = useOrdersData();

  const [isLoading, setIsLoading] = useState<any>(null);

  const rowActions = [
    {
      name: "Cancel",
      key: "cancel",
      action: async (orderId: any) => {
        setIsLoading(orderId);
        await onCancelOrderClick(orderId, refetch);
        setIsLoading(false);
      },
    },

    {
      name: "Edit",
      key: "edit",
      action: (orderId: any) => {
        navigateToOrderDetails();
      },
    },
    {
      name: "Generate Pick List",
      key: "picklist",
      action: (orderId: string) => {
        onGeneratePickListsClick([orderId]);
      },
    },
    {
      name: "Generate Delivery Note",
      key: "delivery-note",
      action: (orderId: string) => {
        onGenerateDeliveryNotesClick([orderId]);
      },
    },
    {
      name: "Manage Milk-Runs",
      key: "mr",
      action: (orderId: string) => {
        navigateToManageMilkRun();
      },
    },
  ];

  const toolbarActions = [
    {
      name: "Cancel",
      key: "cancel",
      action: async () => {
        setIsLoading(true);
        await onCancelMultipleOrdersClick(selectedOrders, refetch);
        setIsLoading(false);
      },
    },
    {
      name: "Generate Pick List",
      key: "picklist",
      action: async () => {
        setIsLoading(true);
        await onGeneratePickListsClick(selectedOrders);
        setIsLoading(false);
      },
    },
    {
      name: "Generate Delivery Note",
      key: "delivery-note",
      action: async () => {
        setIsLoading(true);
        await onGenerateDeliveryNotesClick(selectedOrders);
        setIsLoading(false);
      },
    },
    {
      name: "Manage Milk-Runs",
      key: "mr",
      action: () => {
        navigateToManageMilkRun();
      },
    },
  ];
  return {
    onPDFIconClick,
    onOrderClick,
    onCancelOrderClick,
    rowActions,
    toolbarActions,
    isLoading,
  };
};
