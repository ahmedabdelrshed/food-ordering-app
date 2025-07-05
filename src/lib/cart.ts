import { CartItem } from "@/store/features/cart/cartSlice";

export const getCartQuantity = (cart: CartItem[]) => {

    return cart.reduce((acc, item) => acc + item.quantity, 0);
}