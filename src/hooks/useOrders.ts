import { useEffect, useRef, useState } from "react";

import { useGetOrders } from "@/hooks/queries/useGetOrders";
import { useOrdersCount } from "./useOrdersCount";

type Ref = {
  reset: () => void;
  changeSelected?: (selected: any) => void;
};
export const useOrders = (status: string) => {
  const { openOrdersCount, validOrdersCount, readyOrdersCount } =
    useOrdersCount();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sort, onSort] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(`status:=${status}`);

  const { data, isLoading } = useGetOrders({
    page: currentPage,
    perPage: itemsPerPage,
    search: search,
    sortBy: sort,
    filterBy: status ? `status:=${status}` : "",
  });

  const paginationRef = useRef<Ref>(null);
  const searchRef = useRef<Ref>(null);
  const sortRef = useRef<Ref>(null);

  const changeSelectedSort = (selected: string) => {
    if (sortRef) {
      const changeSelected = sortRef?.current?.changeSelected;
      changeSelected && changeSelected(selected);
    }
  };

  useEffect(() => {
    searchRef.current?.reset();
    paginationRef.current?.reset();
    sortRef.current?.reset();
  }, [status]);

  // useEffect(() => {
  //   sortRef.current?.changeSelected({ name: "test", key: "test" });
  // }, [sort]);

  return {
    orders: data?.orders,
    totalOrders: data?.totalOrders,
    isLoading,
    selectedStatus: status,
    openOrdersCount,
    validOrdersCount,
    readyOrdersCount,
    setItemsPerPage,
    setCurrentPage,
    setSearch,
    onSort,
    changeSelectedSort,
    refs: { paginationRef, searchRef, sortRef },
  };
};
