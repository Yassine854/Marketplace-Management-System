import { signIn, signOut } from "next-auth/react";

import { auth } from "@/services/auth";
import { useNavigation } from "./useNavigation";

export const useAuth = () => {
  const { navigateToLogin } = useNavigation();

  const login = async (username: string, password: string) =>
    signIn("credentials", {
      username,
      password,
      redirect: false,
    });

  const logout = async () => {
    await signOut({ redirect: false });
    navigateToLogin();
  };

  return { login, logout, getSession: auth };
};
