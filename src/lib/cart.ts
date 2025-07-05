import { CartItem } from "@/store/features/cart/cartSlice";

export const getCartQuantity = (cart: CartItem[]) => {

    return cart.reduce((acc, item) => acc + item.quantity, 0);
}

export const deliveryFee = 5;

export const getSubTotal = (cart: CartItem[]) => {
    return cart.reduce((acc, item) => acc + item.price, 0);
};