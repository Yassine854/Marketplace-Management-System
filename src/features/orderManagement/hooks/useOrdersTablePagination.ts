import { useOrdersTableStore } from "@/features/orderManagement/stores/ordersTableStore";
import { useRef, useEffect } from "react";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";

export const useOrdersTablePagination = () => {
  const { status } = useOrdersStore();
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    useOrdersTableStore();
  const paginationRef = useRef(null);

  useEffect(() => {
    //@ts-ignore
    paginationRef.current?.reset();
  }, [status]);

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    paginationRef,
  };
};
