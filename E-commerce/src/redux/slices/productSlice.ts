import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// product type
// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   image: string;
// }
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// initial state for products
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// initial state
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// create an async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { getState }) => {
    const state: any = getState();

    // if products already exist, return them
    if (state.products.products.length > 0) {
      return state.products.products;
    }

    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();
    console.log('data: fetch products ', data);
    return data.products;
  }
);

// create product slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export default productSlice.reducer;