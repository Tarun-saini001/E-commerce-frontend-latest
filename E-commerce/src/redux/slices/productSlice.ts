import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API = import.meta.env.VITE_API_URL;
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
  categoryName: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// initial state for products
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string
}

// initial state
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  searchTerm: ""
};

// create an async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (category: string | null) => {
    let url = `${API}/service/product/`;

    if (category) {
      url += `?category=${category}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    console.log('data: get products', data);

    return data.data;
  }
);

// create product slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
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


export const { setSearchTerm } = productSlice.actions;
export default productSlice.reducer;