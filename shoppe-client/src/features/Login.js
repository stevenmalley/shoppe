import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './store/auth';

function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogin(username,password) {
    await dispatch(login(username,password));
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