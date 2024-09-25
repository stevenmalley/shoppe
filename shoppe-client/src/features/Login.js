import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, login } from './store/auth';
import { getCart } from './store/cart';
import { getOrders } from './store/orders';
import GoogleLogin from './GoogleLogin'

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
    <div>
      <form onSubmit={async(event)=>{
        event.preventDefault();
        handleLogin(event.target.username.value,event.target.password.value);
      }} className="authorisationForm">
        <table>
          <tr>
            <th><label htmlFor="username">username</label></th>
            <td><input type="text" name="username" id="username" /></td>
          </tr>
          <tr>
            <th><label htmlFor="password">password</label></th>
            <td><input type="password" name="password" id="password" /></td>
          </tr>
        </table>
        <input type="submit" value="SUBMIT" className="shoppeButton" />
      </form>
      {auth.failed ? <div style={{color:"red",fontWeight:"bold"}}>LOGIN FAILED</div> : ""}
      <GoogleLogin />
    </div>
  );
}

export default Login;