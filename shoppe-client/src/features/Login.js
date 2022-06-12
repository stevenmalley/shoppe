import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, login } from './store/auth';
import { getCart } from './store/cart';
import { getOrders } from './store/orders';

function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogin(username,password) {
    dispatch(login(username,password));
  }

  const auth = useSelector(selectAuth);
  useEffect(()=>{ // after login has succeeded, load the user's cart and orders and navigate to the home page
    if (auth.login) {
      dispatch(getCart());
      dispatch(getOrders());
      navigate("/");
    }
  },[auth]);

  return (
    <form onSubmit={async(event)=>{
      event.preventDefault();
      handleLogin(event.target.username.value,event.target.password.value);
    }}>
      <label htmlFor="username">USERNAME: </label><input type="text" name="username" id="username" />
      <br />
      <label htmlFor="password">PASSWORD: </label><input type="text" name="password" id="password" />
      <br />
      <input type="submit" value="SUBMIT" />
    </form>
  );
}

export default Login;