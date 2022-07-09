import { createSlice } from '@reduxjs/toolkit';

const cartOptions = {
  name: "cart",
  initialState: [],
  reducers: {
    getCart:(cart,action) => action.payload,
    addToCart:(cart,action) => {
      const product = cart.find(p => p.id === action.payload.productID);
      if (product) product.quantity = action.payload.quantity;
      else cart.push(action.payload);
    },
    modifyCart:(cart,action) => {},
    removeFromCart:(cart,action) => cart.filter(product => product.id != action.payload.productID),
    purchaseCart:(cart,action) => cart.filter(product => !action.payload.products.some(p => p.product_id === product.id)),
    clearCart:(cart,action) => []
  }
}

export const cartSlice = createSlice(cartOptions);