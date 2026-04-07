'use client'
import type { ReactNode } from "react";
import Header from "../Components/Header";
import Cart from "../Components/Cart";
import {useState} from "react";
import { useUiStore } from "../Store/uiStore";
import MobileNav from "../Components/MobileNav";
import { useMobileNavStore } from "../Store/mobileNavStore";
import AdminHeader from "./AdminHeader";



export default function HeaderLayout({ children }: { children: ReactNode }) {


  return (
    <>
      <AdminHeader/>
      <main>{children}</main>
    </>
  );
}
