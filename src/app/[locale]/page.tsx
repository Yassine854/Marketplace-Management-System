import { auth } from "@/services/auth";
import { redirect } from "next/navigation";
import type { User } from "@/types/user";

export default async function Root() {
  const session = await auth();
  const user = session?.user as User;
  if (!user) {
    redirect("/en/login");
  } else if (user.roleId === "1") {
    redirect("/marketplace/dashboard");
  } else if (user.userType === "partner") {
    redirect("/marketplace/partners/dashboard");
  }
}
