'use client'
import type { ReactNode } from "react";
import Header from "../Components/Header";
import Cart from "../Components/Cart";
import {useState} from "react";
import { useUiStore } from "../Store/uiStore";



export default function HeaderLayout({ children }: { children: ReactNode }) {

  const cartOpen = useUiStore((s) => s.cartOpen);
  const closeCart = useUiStore((s) => s.closeCart);
  const openCart = useUiStore((s) => s.openCart);


  return (
    <>
      <Header onCartClick={openCart}/>
      <main>{children}</main>
      <Cart open={cartOpen} onClose={closeCart}></Cart>
    </>
  );
}
