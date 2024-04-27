import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/libs/i18nNavigation";

import { useGetOrders } from "@/hooks/queries/useGetOrders";

export const useSidebarOrdersSubMenu = (isActive: boolean) => {
  const pathname = usePathname();
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState(isActive);

  const { data: openOrders } = useGetOrders({
    status: "open",
    page: 1,
    perPage: 10,
  });

  const { data: validOrders } = useGetOrders({
    status: "valid",
    page: 1,
    perPage: 10,
  });

  const { data: readyOrders } = useGetOrders({
    status: "shipped",
    page: 1,
    perPage: 10,
  });

  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  return {
    openOrdersCount: openOrders?.totalOrders,
    validOrdersCount: validOrders?.totalOrders,
    readyOrdersCount: readyOrders?.totalOrders,
    isOpen,
    setIsOpen,
    push,
    pathname,
  };
};
