import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkLogin, selectAuth } from './store/auth.js';
import Account from './Account.js';

const User = () => {

  const isAuthenticated = useSelector(selectAuth).login;
  const dispatch = useDispatch();

  //useEffect(()=>{dispatch(checkLogin())},[]);

  if (isAuthenticated) {
    
    return (
      <Account />
    );
  } else return (
    <div>not logged in</div>
  );
}

export default User;