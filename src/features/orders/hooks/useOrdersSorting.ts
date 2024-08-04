import { useRef, useEffect } from "react";
import { useOrdersStore } from "@/features/orders/stores/ordersStore";
import { useOrdersTableStore } from "@/features/orders/stores/ordersTableStore";

export const useOrdersSorting = () => {
  const { status } = useOrdersStore();
  const { sort, setSort } = useOrdersTableStore();

  const sortRef = useRef(null);

  const changeSelectedSort = (selected: any) => {
    //@ts-ignore
    sortRef.current?.changeSelected?.(selected);
  };

  useEffect(() => {
    //@ts-ignore
    sortRef.current?.reset();
  }, [status]);

  return {
    sort,
    setSort,
    sortRef,
    changeSelectedSort,
  };
};
