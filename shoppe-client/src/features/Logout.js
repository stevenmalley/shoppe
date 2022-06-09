import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from "./store/auth";
import { useEffect } from 'react';

function Logout() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(logout());
    navigate("/");
  },[]);

  return <div>logging out...</div>;
}

export default Logout;