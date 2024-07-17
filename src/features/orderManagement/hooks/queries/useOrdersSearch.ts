import { useRef, useEffect } from "react";
import { useOrdersStore } from "@/stores/ordersStore";
import { useOrdersTableStore } from "@/stores/ordersTableStore";

export const useOrdersSearch = () => {
  const searchRef = useRef(null);
  const { status } = useOrdersStore();
  const { search, setSearch } = useOrdersTableStore();

  useEffect(() => {
    //@ts-ignore
    searchRef.current?.reset();
  }, [status]);

  return {
    search,
    setSearch,
    searchRef,
  };
};
