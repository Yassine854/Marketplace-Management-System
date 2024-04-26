import { useEffect, useState } from "react";

import { useGetOrders } from "@/hooks/queries/useGetOrders";

type Order = "ASC" | "DSC";

type SortDataFunction<T> = (col: keyof T | string) => void;
type DeleteItemFunction<T> = (id: number | string) => void;
type PaginateFunction = (page: number) => void;
type SearchFunction<T> = (term: string) => void;

// interface SortableTableHook<T> {
//   orders: T[];
//   currentPage: number;
//   itemsPerPage: number;
//   totalPages: number;
//   // sortData: SortDataFunction<T>;
//   // deleteItem: DeleteItemFunction<T>;
//   paginate: PaginateFunction;
//   nextPage: () => void;
//   prevPage: () => void;
//   // search: SearchFunction<T>;
//   startIndex: number;
//   endIndex: number;
//   totalData: number;
// }

export const useOrdersTable = (status: string): any => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { data, isLoading } = useGetOrders({
    status: status,
    page: currentPage,
    perPage: itemsPerPage,
  });

  const [orders, setOrders] = useState<any>(data?.orders);
  // const [order, setOrder] = useState<Order>("ASC");

  const paginate: PaginateFunction = (page) => {
    setCurrentPage(page);
  };
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  // const search: SearchFunction<T> = (term) => {
  //   const filteredData = initialData.filter((item) =>
  //     Object.values(item).some((value) =>
  //       String(value).toLowerCase().includes(term.toLowerCase()),
  //     ),
  //   );
  //   setOrders(filteredData);
  //   setCurrentPage(1);
  // };

  //const indexOfLastItem = currentPage * itemsPerPage;
  //const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data?.total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, data?.total - 1);

  return {
    orders,
    currentPage,
    itemsPerPage,
    totalPages,
    paginate,
    // search,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
    total: data?.total,
    isLoading,
    setItemsPerPage,
  };
};
