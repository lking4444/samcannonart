"use client";

import { useEffect } from "react";
import { useCartStore } from "@/app/Store/cartStore";

export default function ClearCartOnSuccess() {
    const clearCart = useCartStore((s) => s.clear);

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return null;
}