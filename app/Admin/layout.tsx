'use client'
import type { ReactNode } from "react";
import AdminHeader from "./Components/AdminHeader";

export default function HeaderLayout({ children }: { children: ReactNode }) {

  return (
    <>
      <AdminHeader/>
      <main>{children}</main>
    </>
  );
}
