import { useEffect, useRef, useState } from "react";

import { useGetOrders } from "@/hooks/queries/useGetOrders";
import { useNavigation } from "../useNavigation";
import { useOrderStore } from "@/stores/orderStore";
import { useOrdersCount } from "../useOrdersCount";

type Ref = {
  reset: () => void;
  changeSelected?: (selected: any) => void;
};

export const useOrders = (status: string) => {
  const { navigateToOrderDetails } = useNavigation();
  const { openOrdersCount, validOrdersCount, readyOrdersCount } =
    useOrdersCount();
  const { setOrderId } = useOrderStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sort, onSort] = useState("");
  const [search, onSearch] = useState("");
  const [filter, setFilter] = useState(`status:=${status}`);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [orders, setOrders] = useState<any>();
  const [selectedOrders, setSelectedOrders] = useState<any[]>([]);
  const [isSomeOrdersSelected, setIsSomeOrdersSelected] =
    useState<boolean>(false);
  const [isAllOrdersSelected, setIsAllOrdersSelected] =
    useState<boolean>(false);

  const paginationRef = useRef<Ref>(null);
  const searchRef = useRef<Ref>(null);
  const sortRef = useRef<Ref>(null);

  const { data, isLoading } = useGetOrders({
    page: currentPage,
    perPage: itemsPerPage,
    search,
    sortBy: sort,
    filterBy: status ? `status:=${status}` : "",
  });

  const onSelectAllClick = (isChecked: boolean) => {
    if (orders) {
      isChecked
        ? setSelectedOrders(orders.map((order: any) => order.id))
        : setSelectedOrders([]);
    }
  };

  const onSelectOrderClick = (isChecked: boolean, orderId: string) => {
    if (orders) {
      setSelectedOrders((prevSelectedOrders) => {
        if (isChecked) {
          return [...prevSelectedOrders, orderId];
        } else {
          return prevSelectedOrders.filter((id) => id !== orderId);
        }
      });
    }
  };

  const changeSelectedSort = (selected: string) => {
    if (sortRef) {
      const changeSelected = sortRef.current?.changeSelected;
      changeSelected && changeSelected(selected);
    }
  };

  const onOrderClick = (orderId: string) => {
    setOrderId(orderId);
    navigateToOrderDetails();
  };

  useEffect(() => {
    searchRef.current?.reset();
    paginationRef.current?.reset();
    sortRef.current?.reset();

    setSelectedOrders([]);
  }, [status]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsOrdersLoading(true);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsOrdersLoading(false);
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      const modifiedOrders = data.orders.map((order: any) => ({
        ...order,
        isSelected: false,
      }));
      setOrders(modifiedOrders);
    }
  }, [data]);

  useEffect(() => {
    setOrders(
      (orders: any) =>
        orders?.map((order: any) => ({
          ...order,
          isSelected: selectedOrders.includes(order.id),
        })),
    );
  }, [selectedOrders]);

  useEffect(() => {
    selectedOrders.length && selectedOrders.length == itemsPerPage
      ? setIsAllOrdersSelected(true)
      : setIsAllOrdersSelected(false);
  }, [selectedOrders, itemsPerPage, status, orders]);
  useEffect(() => {
    selectedOrders.length
      ? setIsSomeOrdersSelected(true)
      : setIsSomeOrdersSelected(false);
  }, [selectedOrders, itemsPerPage, status, orders]);

  return {
    orders,
    totalOrders: data?.totalOrders,
    isLoading: isOrdersLoading,
    selectedStatus: status,
    openOrdersCount,
    validOrdersCount,
    readyOrdersCount,
    setItemsPerPage,
    setCurrentPage,
    onSearch,
    onSort,
    changeSelectedSort,
    onOrderClick,
    onSelectAllClick,
    onSelectOrderClick,
    isAllOrdersSelected,
    isSomeOrdersSelected,
    refs: { paginationRef, searchRef, sortRef },
  };
};
