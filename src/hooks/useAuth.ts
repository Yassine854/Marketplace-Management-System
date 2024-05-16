import { auth } from "@/services/auth";
import { signIn } from "next-auth/react";
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
