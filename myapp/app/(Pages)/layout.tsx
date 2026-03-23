'use client'
import type { ReactNode } from "react";
import Header from "../Components/Header";
import Cart from "../Components/Cart";
import {useState} from "react";
import { useUiStore } from "../Store/uiStore";
import MobileNav from "../Components/MobileNav";
import { useMobileNavStore } from "../Store/mobileNavStore";



export default function HeaderLayout({ children }: { children: ReactNode }) {

  const cartOpen = useUiStore((s) => s.cartOpen);
  const closeCart = useUiStore((s) => s.closeCart);
  const openCart = useUiStore((s) => s.openCart);

  const navOpen = useMobileNavStore((s) => s.navOpen);
  const closeNav = useMobileNavStore((s) => s.closeNav);
  const openNav = useMobileNavStore((s) => s.openNav)


  return (
    <>
      <Header onCartClick={openCart} onNavClick={openNav}/>
      <main>{children}</main>
      <Cart open={cartOpen} onClose={closeCart}></Cart>
      <MobileNav onCartClick={openCart} open={navOpen} onClose={closeNav}/>
    </>
  );
}
