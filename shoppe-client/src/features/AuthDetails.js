import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, checkLogin } from './store/auth.js';


function AuthDetails() {

  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  useEffect(()=>{dispatch(checkLogin())},[]);

  if (auth.login) {
    return (
      <div>
        <NavLink className="authDetails" to={"/user/"+auth.username}>user account</NavLink>
        <NavLink className="authDetails" to="/logout">log out</NavLink>
      </div>
    );
  } else return (
    <div>
      <NavLink className="authDetails" to="/register">register</NavLink>
      <NavLink className="authDetails" to="/login">log in</NavLink>
    </div>
  );
}

export default AuthDetails;