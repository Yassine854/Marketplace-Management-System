import { signIn, signOut, useSession } from "next-auth/react";

import { useNavigation } from "./useNavigation";

export const useAuth = () => {
  const { navigateToLogin } = useNavigation();
  const { data, status } = useSession();

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

  return { login, logout, user: data?.user, status };
};
