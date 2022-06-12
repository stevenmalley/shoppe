import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import AuthDetails from './features/AuthDetails';
import Header from './features/Header';
import Home from './features/Home';
import Products from './features/Products';
import ProductPage from './features/ProductPage';
import Register from './features/Register';
import Login from './features/Login';
import Logout from './features/Logout';
import Cart from './features/Cart';
import User from './features/User';
import { authSlice } from './features/store/authSlice';
import { homeSlice } from './features/store/homeSlice';
import { productSlice } from './features/store/productSlice';
import { cartSlice } from './features/store/cartSlice';
import './App.css';


const store = configureStore({
  reducer: combineReducers({
    auth:authSlice.reducer,
    home:homeSlice.reducer,
    product:productSlice.reducer,
    cart:cartSlice.reducer})
});

function App() {
  return (
    <div className="App">
      <Router>
      <Provider store={store}>
      <AuthDetails />
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/" element={<Products />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/user/:userID" element={<User />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Provider>
      </Router>
    </div>
  );
}

export default App;
