import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;

// Category type
export interface Category {
  _id: string;
  name: string;
}

interface CategoryState {
  categories: Category[];
  allCategories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  allCategories: [],
  loading: false,
  error: null,
};


export const fetchCategories = createAsyncThunk(
  "category/fetch",
  async () => {
    const res = await fetch(`${API}/service/category/`);
    const data = await res.json();
    console.log('data:get categories ', data);
    return data.data.categories;
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
        state.categories = action.payload;
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