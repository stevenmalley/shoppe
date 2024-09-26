import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from './store/auth';
import './Authorisation.css';

function Register() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleRegister(user) {
    user = {name: user.name.value,
      email: user.email.value,
      username: user.username.value,
      password: user.password.value};
    dispatch(register(user));
    navigate("/");
  }

  return (
    <form onSubmit={async(event)=>{
      event.preventDefault();
      handleRegister(event.target);
    }} className="authorisationForm">
      <table>
        <tbody>
          <tr>
            <th>
              <label htmlFor="name">name </label>
            </th>
            <td>
              <input type="text" name="name" id="name" />
            </td>
          </tr>
          <tr>
            <th>
              <label htmlFor="email">email </label>
            </th>
            <td>
            <input type="text" name="email" id="email" />
            </td>
          </tr>
          <tr>
            <th>
              <label htmlFor="username">username </label>
            </th>
            <td>
              <input type="text" name="username" id="username" />
            </td>
          </tr>
          <tr>
            <th>
              <label htmlFor="password">password </label>
            </th>
            <td>
              <input type="password" name="password" id="password" />
            </td>
          </tr>
        </tbody>
      </table>
      <input type="submit" value="SUBMIT" className="shoppeButton" />
    </form>
  );
}

export default Register;