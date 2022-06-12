import { createSlice } from '@reduxjs/toolkit';

const productOptions = {
  name: "product",
  initialState: [],
  reducers: {
    allProducts:(product,action) => action.payload,
    oneProduct:(product,action) => [action.payload]
  }
}

export const productSlice = createSlice(productOptions);