import { useOrdersData } from "@/features/orders/hooks";
import { useGetOrdersCount } from "@/features/orders/hooks";
import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "@/libs/next-intl/i18nNavigation";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export const useSidebar = (setSidebar: any) => {
  const { push } = useRouter();

  const pathname = usePathname();

  const { selectedStatus } = useOrdersData();
  const { storeId } = useGlobalStore();

  const { openOrdersCount, validOrdersCount, readyOrdersCount } =
    useGetOrdersCount({ storeId });

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const currentWindowSize = window.innerWidth;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        if (currentWindowSize < 1400) {
          setSidebar(false);
        }
      }
    },
    [setSidebar],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return {
    push,
    pathname,
    sidebarRef,
    selectedStatus,
    openOrdersCount,
    validOrdersCount,
    readyOrdersCount,
  };
};
