import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    loadWishlist: (state, action) => {
      state.items = action.payload || [];
    },

    addToWishlist: (state, action) => {
      const product = action.payload;

      const exists = state.items.some(
        (item) => String(item.id) === String(product.id)
      );

      if (!exists) {
        state.items.push(product);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => String(item.id) !== String(action.payload)
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    }
  }
});

export const {
  loadWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;