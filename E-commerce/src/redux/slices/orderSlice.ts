import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;

interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  brand: string;
  category: string;
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
  subtotal: number;     
  shippingFee: number;  
  tax: number;
  total: number;
  shippingMethod: string;
  orderStatus: string;
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};


export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/service/order/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log('data:get order by id ', data);

      if (!res.ok) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch order");
    }
  }
);

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/service/order/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch orders");
      }

      const data = await res.json();
      return data.data; // array of orders
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch orders");
    }
  }
);

// Create a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/service/order/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message);
      }

      return data.data; // single created order
    } catch (error) {
      return rejectWithValue("Server error");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchOrders
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createOrder
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.orders.unshift(action.payload); // add new order to history
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch order by id
    builder.addCase(fetchOrderById.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchOrderById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedOrder = action.payload;
    });

    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default orderSlice.reducer;