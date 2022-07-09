import { useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Products from './Products';
import ProductPage from './ProductPage';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Cart from './Cart';
import Orders from './Orders';
import Order from './Order';
import User from './User';
import { selectAuth } from './store/auth';

export default function AppRoutes() {

    const login = useSelector(selectAuth).login;

    return (
        <Routes>
            {/* public routes */}
            <Route path="/"                     element={<Home />} />
            <Route path="/product/"             element={<Products />} />
            <Route path="/product/:productId"   element={<ProductPage />} />
            <Route path="/register"             element={<Register />} />
            <Route path="/login"                element={<Login />} />

            {/* private routes */}
            <Route path="/cart"             element={login ? <PrivateRoute component={<Cart />} />   : <Navigate replace to="/login" />} />
            <Route path="/orders"           element={login ? <PrivateRoute component={<Orders />} /> : <Navigate replace to="/login" />} />
            <Route path="/orders/:orderID"  element={login ? <PrivateRoute component={<Order />} />  : <Navigate replace to="/login" />} />
            <Route path="/user/:userID"     element={login ? <PrivateRoute component={<User />} />   : <Navigate replace to="/login" />} />
            <Route path="/logout"           element={login ? <PrivateRoute component={<Logout />} /> : <Navigate replace to="/login" />} />

        {/*
            <Route path="/cart"             element={login ? <Cart />   : <Navigate replace to="/login" />} />
            <Route path="/orders"           element={login ? <Orders /> : <Navigate replace to="/login" />} /> 
            <Route path="/orders/:orderID"  element={login ? <Order />  : <Navigate replace to="/login" />} />
            <Route path="/user/:userID"     element={login ? <User />   : <Navigate replace to="/login" />} />
            <Route path="/logout"           element={login ? <Logout /> : <Navigate replace to="/login" />} />
        */}
        
        </Routes>
    );
}
