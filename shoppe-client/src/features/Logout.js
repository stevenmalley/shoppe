import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from "./store/cart";
import { useEffect } from 'react';
import { logout } from './store/auth';

function Logout() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(logout())
    dispatch(clearCart());
    navigate("/");
  },[]);

  return <div>logging out...</div>;
}

export default Logout;