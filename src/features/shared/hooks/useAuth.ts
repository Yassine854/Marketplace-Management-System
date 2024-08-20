import { useResetStores } from "./useResetStores";
import { signIn, signOut, useSession } from "next-auth/react";
import { useNavigation } from "@/features/shared/hooks/useNavigation";

export const useAuth = () => {
  const { data, status } = useSession();
  const resetAllStores = useResetStores();
  const { navigateToLogin } = useNavigation();

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
  };

  return { login, logout, user: data?.user, status };
};
