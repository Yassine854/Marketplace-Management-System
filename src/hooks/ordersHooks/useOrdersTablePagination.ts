import { useRef, useEffect } from "react";
import { useOrdersStore } from "@/stores/ordersStore";

export const useOrdersTablePagination = () => {
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage, status } =
    useOrdersStore();

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
