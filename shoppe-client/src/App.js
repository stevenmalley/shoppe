import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import AuthDetails from './features/AuthDetails';
import Header from './features/Header';
import AppRoutes from './features/AppRoutes';
import { authSlice } from './features/store/authSlice';
import { homeSlice } from './features/store/homeSlice';
import { productSlice } from './features/store/productSlice';
import { cartSlice } from './features/store/cartSlice';
import { ordersSlice } from './features/store/ordersSlice';

const store = configureStore({
  reducer: combineReducers({
    auth:authSlice.reducer,
    home:homeSlice.reducer,
    product:productSlice.reducer,
    cart:cartSlice.reducer,
    orders:ordersSlice.reducer})
});

function App() {

  return (
    <div className="App">
      <Router>
        <Provider store={store}>
          <AuthDetails />
          <Header />
          <AppRoutes />
        </Provider>
      </Router>
    </div>
  );
}

export default App;
