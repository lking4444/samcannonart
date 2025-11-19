import type { ReactNode } from "react";
import Header from "../Components/Header";

export default function HeaderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
