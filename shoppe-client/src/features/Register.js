import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, register } from './store/auth';

function Register() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleRegister(user) {
    user = {name: user.name.value,
      email: user.email.value,
      username: user.username.value,
      password: user.password.value};
    await dispatch(register(user));
    await dispatch(login(user.username,user.password));
    navigate("/");
  }

  return (
    <form onSubmit={async(event)=>{
      event.preventDefault();
      handleRegister(event.target);
    }}>
      <label htmlFor="name">NAME: </label><input type="text" name="name" id="name" />
      <br />
      <label htmlFor="email">EMAIL: </label><input type="text" name="email" id="email" />
      <br />
      <label htmlFor="username">USERNAME: </label><input type="text" name="username" id="username" />
      <br />
      <label htmlFor="password">PASSWORD: </label><input type="text" name="password" id="password" />
      <br />
      <input type="submit" value="SUBMIT" />
    </form>
  );
}

export default Register;