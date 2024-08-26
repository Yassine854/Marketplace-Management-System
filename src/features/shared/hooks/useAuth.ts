import { useResetStores } from "./useResetStores";
import { signIn, signOut, useSession } from "next-auth/react";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useGlobalStore } from "../stores/GlobalStore";

export const useAuth = () => {
  const { data, status } = useSession();
  const resetAllStores = useResetStores();
  const { navigateToLogin } = useNavigation();
  const { reset } = useGlobalStore();

  const login = async (username: string, password: string) =>
    signIn("credentials", {
      username,
      password,
      redirect: false,
    });

  const logout = async () => {
    await signOut({ redirect: false });
    resetAllStores();
    localStorage.clear();
    navigateToLogin();
    reset();
  };

  return { login, logout, user: data?.user, status };
};
