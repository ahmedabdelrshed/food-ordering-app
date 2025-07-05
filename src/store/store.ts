import { Environments } from '@/lib/constants'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
export const store = configureStore({
    reducer: {
        cart: cartReducer
    },
    devTools: process.env.NODE_ENV === Environments.DEV,
})


//  Save cart state to localStorage whenever it changes
store.subscribe(() => {
    const state = store.getState();
    const cartState = state.cart;
    localStorage.setItem('cart', JSON.stringify(cartState));
});

    
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch