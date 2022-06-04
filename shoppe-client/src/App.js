import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Header from './features/Header';
import Home from './features/Home';
import Products from './features/Products';
import ProductPage from './features/ProductPage';
import { homeSlice } from './features/store/homeSlice';
import { productSlice } from './features/store/productSlice';
import logo from './logo.svg';
import './App.css';


const store = configureStore({
  reducer: combineReducers({
    home:homeSlice.reducer,
    product:productSlice.reducer})
});

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/" element={<Products />} />
          <Route path="/product/:productId" element={<ProductPage />} />
        </Routes>
      </Provider>
      </Router>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
