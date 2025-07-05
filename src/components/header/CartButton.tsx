"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect } from "react";
import Link from "../Link/Link";
import { Routes } from "@/lib/constants";
import { ShoppingCartIcon } from "lucide-react";
import { hydrateCart, selectCartItems } from "@/store/features/cart/cartSlice";
import { getCartQuantity } from "@/lib/cart";
import { useParams } from "next/navigation";


const CartButton = () => {
      const { lang } = useParams();
    const dispatch = useAppDispatch();
    useEffect(() => {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch(hydrateCart(parsed.items)); // You'd define this action
      }
    }, [dispatch]);
  const cart = useAppSelector(selectCartItems);
  const cartQuantity = getCartQuantity(cart);
  return (
    <Link href={`/${lang}/${Routes.CART}`} className="block relative group">
      <span className="absolute -top-4 start-4 w-5 h-5 text-sm bg-primary rounded-full text-white text-center">
        {cartQuantity}
      </span>
      <ShoppingCartIcon
        className={`text-accent group-hover:text-primary duration-200 transition-colors !w-6 !h-6`}
      />
    </Link>
  );
};

export default CartButton;
