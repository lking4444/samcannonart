import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import ShippingAdmin from "./ShippingAdmin";

export default async function ShippingPage() {
  if (!(await requireAdmin())) redirect("/login");
  return <ShippingAdmin />;
}
