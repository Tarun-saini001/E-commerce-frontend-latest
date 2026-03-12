import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "./productSlice";

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    total: number;
    loading: boolean;
    error: string | null
}

const initialState: CartState = {
    items: [],
    total: 0,
    loading: false,
    error: null
};

interface CartResponse {
  items: CartItem[];
  subtotal: number;
}

const API = import.meta.env.VITE_API_URL;

//fetch cart data
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
    const res = await fetch(`${API}/service/cart/`, { credentials: "include",method:"GET" })
    const data = await res.json();
    console.log(' data.data.items: ',  data.data.items);
    return data.data as CartResponse;
})

//add to cart
export const addToCart = createAsyncThunk(
    "cart/add",
    async (product: Product) => {
        const { id, title, price, thumbnail, brand, category } = product
        const quantity=1;
        const res = await fetch(`${API}/service/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id, title, price, thumbnail, brand, category, quantity }),
        });
        const data = await res.json();
        console.log('add to cart res: ', data);
        return data.data as CartResponse;
    }
);

// update quantity
export const updateCartQuantity = createAsyncThunk("cart/updateQuantity", async ({ productId, quantity }: { productId: number, quantity: number }) => {
    console.log('productId: ', productId);
    const res = await fetch(`${API}/service/cart/update/${productId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity })
    });
    const data = await res.json();
    console.log('data: update quantity', data);
    console.log('update quantity res: ', data);
    return data.data as CartResponse;
})



// remove item
export const removeItem = createAsyncThunk(
    "cart/remove",
    async (productId: number) => {
        const res = await fetch(`${API}/service/cart/${productId}`, {
            method: "DELETE",
            credentials: "include",
        });
        const data = await res.json();
        console.log('remove cart item res: ', data);
        return data.data as CartResponse;
    }
);

//clear cart
export const clearCart = createAsyncThunk("cart/clear", async () => {
    const res = await fetch(`${API}/service/cart/`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    console.log('clear cart res:', data);
    return data.data as  CartResponse;
});


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // addToCart: (state, action: PayloadAction<Product>) => {
        //     const existingItem = state.items.find(item => item.id === action.payload.id);
        //     if (existingItem) {
        //         existingItem.quantity += 1;
        //     } else {
        //         state.items.push({ ...action.payload, quantity: 1 });
        //     }
        //     state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        // },
        // removeFromCart: (state, action: PayloadAction<number>) => {
        //     state.items = state.items.filter(item => item.id !== action.payload);
        //     state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        // },
        // increaseQuantity: (state, action: PayloadAction<number>) => {
        //     const item = state.items.find(i => i.id === action.payload);
        //     if (item) {
        //         item.quantity += 1;
        //     }
        //     state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        // },
        // decreaseQuantity: (state, action: PayloadAction<number>) => {
        //     const item = state.items.find(i => i.id === action.payload);
        //     if (item && item.quantity > 1) {
        //         item.quantity -= 1;
        //     }
        //     state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        // },
        // clearCart: (state) => {
        //     state.items = [];
        //     state.total = 0;
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                console.log('state.items: ', state.items);
                state.loading = false,
                    state.items = action.payload.items,
                    state.total = state.items.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                    )
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.error = action.error.message || "Failed to fetch cart"
            })

            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.total = state.items.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
            })

            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.total = state.items.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
            })

            .addCase(removeItem.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.total = state.items.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
            })

            .addCase(clearCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.total = 0
            })
    }
});

// export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;