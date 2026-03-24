import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

interface WishlistItem {
  id: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

const API = import.meta.env.VITE_API_URL;

// get wishlist
export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
  const res = await fetch(`${API}/service/wishlist`, {
    credentials: "include",
  });

  const data = await res.json();
  console.log('data: getwishlist ', data);
  return data.data.items;
});


// toggle wishlist
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productId: string) => {
    const res = await fetch(`${API}/service/wishlist/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    console.log('data: toggle wishlist', data);
    return data.data.items;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch wishlist";
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default wishlistSlice.reducer;