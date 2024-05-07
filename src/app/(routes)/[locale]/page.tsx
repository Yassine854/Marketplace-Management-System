import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";
export default async function Root() {
  const session = await auth();
  if (!session?.user) {
    redirect("/en/login");
  } else {
    redirect("/dashboard");
  }
}
