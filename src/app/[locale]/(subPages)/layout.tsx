"use client";

import MainLayout from "@/features/layout/MainLayout";
import { useAuth } from "@/features/shared/hooks/useAuth";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useEffect } from "react";

const MainLayoutRoute = ({ children }: any) => {
  const { user } = useAuth();
  const { setStoreId, setIsNoEditUser, setIsAdmin } = useGlobalStore();

  useEffect(() => {
    //@ts-ignore
    switch (user?.roleId) {
      case "1":
        setStoreId("1");
        setIsAdmin(true);
        break;
      case "5":
        setStoreId("1");
        setIsNoEditUser(true);
        break;
      case "2":
        setStoreId("2");
        break;
      case "3":
        setStoreId("2");
        break;
      case "4":
        setStoreId("4");
        break;
    }
  }, [user, setStoreId]);

  return <MainLayout>{children}</MainLayout>;
};
export default MainLayoutRoute;
