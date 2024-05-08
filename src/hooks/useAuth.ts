import { auth } from "@/libs/next-auth";
import { signIn } from "next-auth/react";
const login = async (username: string, password: string) =>
  await signIn("credentials", {
    username,
    password,
    redirect: false,
  });

const getSession = async () => await auth();
export const useAuth = () => {
  return { login, getSession };
};
