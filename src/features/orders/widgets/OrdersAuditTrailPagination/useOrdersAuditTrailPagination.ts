import { useEffect, useState } from "react";
import { useOrdersData } from "@/features/orders/hooks";
import { useOrdersTableStore } from "@/features/orders/stores/ordersTableStore";
import { getAllOrdersLogs } from "@/clients/prisma/getAllOrdersLogs";
import { useOrdersAuditTrailTableStore } from "@/features/auditTrail/stores/ordersAuditTrailTableStore";
import { useGetOrdersAuditTrail } from "@/features/auditTrail/hooks/useGetOrdersAuditTrail";

export const useOrdersAuditTrailPagination = () => {
  const [endIndex, setEndIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const { currentPage, itemsPerPage } = useOrdersAuditTrailTableStore();
  const { auditTrail } = useGetOrdersAuditTrail(currentPage - 1);
  let totalItems = auditTrail?.length;

  useEffect(() => {
    setEndIndex(Math.min(startIndex + itemsPerPage + 1, totalItems - 1));
  }, [startIndex, itemsPerPage, totalItems, setEndIndex]);

  useEffect(() => {
    setStartIndex((currentPage - 1) * itemsPerPage);
  }, [currentPage, itemsPerPage, setStartIndex]);

  return {
    endIndex,
    totalItems,
    startIndex,
  };
};
