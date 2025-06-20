import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, checkLogin } from './store/auth.js';


function AuthDetails() {

  const auth = useSelector(selectAuth);
  //const dispatch = useDispatch();

  //useEffect(()=>{dispatch(checkLogin())},[]);

  if (auth.login) {
    return (
      <div className="authBar">
        <div className="authButtons">
          <span className="welcomeUser">Welcome {auth.name}</span>
          <NavLink className="authDetails" to={"/cart"}>cart</NavLink>
          <NavLink className="authDetails" to={"/orders"}>order history</NavLink>
          <NavLink className="authDetails" to={"/user/"+auth.username}>user account</NavLink>
          <NavLink className="authDetails" to="/logout">log out</NavLink>
        </div>
      </div>
    );
  } else return (
    <div className="authBar">
      <div className="authButtons">
        <NavLink className="authDetails" to="/register">register</NavLink>
        <NavLink className="authDetails" to="/login">log in</NavLink>
      </div>
    </div>
  );
}

export default AuthDetails;