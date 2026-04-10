import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../services/url";
import { FetchAPI } from "../../services/API/FetchAPI";
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
  _id: string;
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
  singleProduct: Product | null;
  loading: boolean;
  error: string | null;
  searchTerm: string

  currentPage: number;
  totalPages: number;
}

// initial state
const initialState: ProductState = {
  products: [],
  singleProduct: null,
  loading: false,
  error: null,
  searchTerm: "",
  currentPage: 1,
  totalPages: 1,
};

//fetch product by id
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id: string) => {
    const res = await fetch(`${API}/service/product/${id}`, {
      method: "GET",
      headers: { "content-type": "application/json" },
      credentials: "include"
    });
    const data = await res.json();
    console.log('data: product by id', data);
    return data.data;
  }
);

// create an async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async ({ category = "", page = 1, limit = 9, search = "" }: { category: string | null; page?: number; limit?: number; search?: string | null }) => {
    let url = `${ENDPOINTS.PRODUCT.GET_ALL}?page=${page}&limit=${limit}`;

    if (category?.trim()) {
      url += `&category=${category}`;
    }

    if (search?.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }

    const data = await FetchAPI<{
      data: {
        products: Product[];
        currentPage: number;
        totalPages: number;
      };
    }>(url);
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
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{
        products: Product[],
        currentPage: number,
        totalPages: number
      }>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      //product by id
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      })
  },
});


export const { setSearchTerm } = productSlice.actions;
export default productSlice.reducer;