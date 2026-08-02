import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { orgRole } = await auth();

  if (orgRole === "org:admin") redirect("/admin");
  if (orgRole === "org:staff") redirect("/pos");

  redirect("/no-access");
}
