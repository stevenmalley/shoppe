import { createSlice } from '@reduxjs/toolkit';

const ordersOptions = {
  name: "orders",
  initialState: [],
  reducers: {
    getOrder:(orders,action) => {
      const order = orders.find(p => p.id == action.payload.orderID);
      if (order) order.sales = action.payload.sales;
    },
    getOrders:(orders,action) => action.payload
  }
}

export const ordersSlice = createSlice(ordersOptions);