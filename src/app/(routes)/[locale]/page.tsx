import { auth } from "@/libs/next-auth";
import { redirect } from "next/navigation";
export default async function Root() {
  const session = await auth();
  if (!session?.user) {
    redirect("/en/login");
  } else {
    redirect("/dashboard");
  }
}
