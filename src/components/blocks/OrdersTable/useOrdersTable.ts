import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useGetOrders } from "@/hooks/queries/useGetOrders";

type PaginateFunction = (page: number) => void;

const sortOptions = [
  { name: "ID", key: "customer_id" },
  { name: "Total", key: "subtotal" },
];

export const useOrdersTable = (status: string): any => {
  const { push } = useRouter();
  const pathname = usePathname();
  console.log("🚀 ~ useOrdersTable ~ pathname:", pathname);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [sortBy, setSortBy] = useState({ name: "Total", key: "subtotal" });
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const actions = [
    {
      name: "Edit",
      key: "edit",
      action: (id: any) => {
        push("/order/" + id);
      },
    },
    { name: "Generate Pick List", key: "picklist", action: () => {} },
    { name: "Print BL's", key: "bl", action: () => {} },
    { name: "Manage Milk-Runs", key: "mr", action: () => {} },
  ];
  const { data, isLoading } = useGetOrders({
    status: status,
    page: currentPage,
    perPage: itemsPerPage,
    sortBy: sortBy.key + ":" + sortOrder,
    search: search,
  });

  const onRowClick = (id: any) => {
    push("/order/" + id);
  };
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

  const selectAllOrders = () => {
    const orders = data.orders.map((order: any) => {
      return { ...order, isSelected: true };
    });
    setOrders(orders);
    orders.forEach((order: any) => {
      //@ts-ignore
      setSelectedOrders((e) => [...e, order.id]);
    });
  };
  const unSelectAllOrders = () => {
    const orders = data.orders.map((order: any) => {
      return { ...order, isSelected: false };
    });
    //@ts-ignore
    setOrders([...orders]);
    setSelectedOrders([]);
  };

  const selectOrder = (id: any) => {
    //@ts-ignore

    setSelectedOrders((list) => [...list, id]);
  };
  const unSelectOrder = (id: any) => {
    const list = selectedOrders.filter((item) => item !== id);

    setSelectedOrders(list);
  };

  useEffect(() => {
    const newTotalPages = Math.ceil(data?.totalOrders / itemsPerPage);
    const newStartIndex = (currentPage - 1) * itemsPerPage;
    const newEndIndex = Math.min(
      startIndex + itemsPerPage - 1,
      data?.totalOrders - 1,
    );

    if (data && newTotalPages !== totalPages) {
      setTotalPages(newTotalPages);
    }

    if (data && newStartIndex !== startIndex) {
      setStartIndex(newStartIndex);
    }

    if (data && newEndIndex !== endIndex) {
      setEndIndex(newEndIndex);
    }
  }, [
    data,
    itemsPerPage,
    totalPages,
    currentPage,
    setStartIndex,
    startIndex,
    endIndex,
    setEndIndex,
  ]);

  useEffect(() => {
    if (data) {
      const orders = data.orders.map((order: any, i: number) => {
        //@ts-ignore

        if (selectedOrders.includes(order.id)) {
          return { ...order, isSelected: true };
        } else {
          return { ...order, isSelected: false };
        }
      });
      //@ts-ignore

      setOrders([...orders]);
    }
  }, [data, selectedOrders]);
  return {
    orders: orders,
    currentPage,
    itemsPerPage,
    totalPages,
    paginate,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
    totalOrders: data?.totalOrders,
    isLoading,
    sortBy,
    sortOptions,
    setSearch,
    sortOrder,
    setSortBy,
    setSelectedOrders,
    unSelectAllOrders,
    selectAllOrders,
    setSortOrder,
    selectOrder,
    unSelectOrder,
    selectedOrders,
    actions,
    onRowClick,
    setItemsPerPage: (numberOfItems: number) => {
      const newCurrentPage = Math.ceil(startIndex / numberOfItems);
      setCurrentPage(newCurrentPage + 1);
      setItemsPerPage(numberOfItems);
    },
  };
};
