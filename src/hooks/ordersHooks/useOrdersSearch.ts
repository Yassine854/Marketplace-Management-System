import { useRef, useEffect } from "react";
import { useOrdersStore } from "@/stores/ordersStore";

export const useOrdersSearch = () => {
  const { search, setSearch, status } = useOrdersStore();
  const searchRef = useRef(null);

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
