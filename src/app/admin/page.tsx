import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import AdminDashboard from "./AdminDashboard";

export const metadata = { title: "Admin · Akazi Hub" };

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");
  return <AdminDashboard />;
}
