import { createSlice } from '@reduxjs/toolkit';

const productOptions = {
  name: "product",
  initialState: [],
  reducers: {
    allProducts:(product,action) => action.payload,
    oneProduct:(product,action) => {
      const productIndex = product.findIndex(p => p.id == action.payload.id);
      if (productIndex === -1) product.push(action.payload);
      else product[productIndex] = action.payload;
    }
  }
}

export const productSlice = createSlice(productOptions);