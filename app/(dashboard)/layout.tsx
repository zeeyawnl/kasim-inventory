import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import DashboardLayoutContent from "./layout-content";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
