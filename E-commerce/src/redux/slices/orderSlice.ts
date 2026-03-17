import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;


interface OrderItem {
    title: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    billingDetails: {
        name: string;
        country: string;
        city: string;
        district: string;
        postalCode: string;
        address: string;
        phone: string;
        email: string;
    };
    items: OrderItem[];
    total: number;
    shippingMethod: string;
    orderStatus: string;
    createdAt: string;
}

interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};

// Fetch all orders
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API}/service/order/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // if your backend uses cookies/auth
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to fetch orders");
        }

        const data = await res.json();
        return data.data; // assuming API responds with { data: orders[] }
    } catch (err: any) {
        return rejectWithValue(err.message || "Failed to fetch orders");
    }
});



export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API}/service/order/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('data: get order history', data);
            console.log('data: place order ', data);

            if (!response.ok) {
                return rejectWithValue(data.message);
            }

            return data.data;
        } catch (error) {
            return rejectWithValue("Server error");
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        loading: false,
        error: null as string | null,
        order: null as any,
    },
    reducers: {},
    extraReducers: (builder) => {

        // fetchOrders
        builder.addCase(fetchOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
            state.loading = false;
            state.order = action.payload;
        });
        builder.addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        //create order
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default orderSlice.reducer;