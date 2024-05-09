import { signIn, signOut } from "next-auth/react";

import { auth } from "@/libs/next-auth";

const login = async (username: string, password: string) =>
  await signIn("credentials", {
    username,
    password,
    redirect: false,
  });

const logout = async () => signOut();

export const useAuth = () => {
  return { login, logout, getSession: auth };
};
