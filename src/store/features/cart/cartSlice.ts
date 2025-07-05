import { RootState } from "@/store/store";
import { Extra } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
    id?: string
    productId: string;
    quantity: number;
    size: string;
    sizeId: string
    price: number
    name: string
    image: string
    extras: Extra[]
}
interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: []
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find((item) => item.productId === action.payload.productId &&
                item.sizeId === action.payload.sizeId
                && item.extras.map((extra) => extra.name).join(',') === action.payload.extras.map((extra) => extra.name).join(','));
            console.log(existingItem)
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
                existingItem.price += action.payload.price;
            } else {
                state.items.push({
                    ...action.payload,
                    id: crypto.randomUUID()
                });
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
        hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
        },
    },
});

export const selectCartItems = (state: RootState) => state.cart.items;

export const { addItem, removeItem, clearCart, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;