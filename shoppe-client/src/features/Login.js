import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './store/auth';
import { getCart } from './store/cart';

function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogin(username,password) {
    dispatch(login(username,password));
    dispatch(getCart());
    navigate("/");
  }

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