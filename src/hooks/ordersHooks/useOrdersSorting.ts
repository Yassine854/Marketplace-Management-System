import { useRef, useEffect } from "react";
import { useOrdersStore } from "@/stores/ordersStore";

export const useOrdersSorting = () => {
  const { sort, setSort, status } = useOrdersStore();

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
