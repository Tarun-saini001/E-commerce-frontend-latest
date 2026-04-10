import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;

// Category type
export interface Category {
  _id: string;
  name: string;
  image: string
}

interface CategoryState {
  categories: Category[];
  allCategories: Category[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: CategoryState = {
  categories: [],
  allCategories: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};


export const fetchCategories = createAsyncThunk(
  "category/fetch",
  async ({ page = 1, limit = 6, search = "" }: { page?: number; limit?: number; search?: string }) => {
    let url = `${API}/service/category/?page=${page}&limit=${limit}`;

    if (search?.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    console.log('data:get categories ', data);
    return data.data;
  }
);
//categories without pagination for category sidebar
export const fetchAllCategories = createAsyncThunk(
  "allCategory/fetch",
  async () => {
    const res = await fetch(`${API}/service/category/withoutPagination`);
    const data = await res.json();
    console.log('data:get all categories ', data);
    return data.data;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      //all categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.allCategories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all categories";
      })

  },
});

export default categorySlice.reducer;