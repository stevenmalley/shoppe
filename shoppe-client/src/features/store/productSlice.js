import { createSlice } from '@reduxjs/toolkit';

const productOptions = {
  name: "product",
  initialState: {products:[{title:"communist manifesto"}]},
  reducers: {
    allProducts:(product,action) => {product.products = action.payload},
    oneProduct:(product,action) => {product.products = action.payload}
  }
}

export const productSlice = createSlice(productOptions);