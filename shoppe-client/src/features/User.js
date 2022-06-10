import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserAccount, checkLogin, selectAuth } from './store/auth.js';

const User = () => {

  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getAccountDetails() {
      await dispatch(checkLogin());
      if (auth.login) {
        dispatch(getUserAccount(auth.username));
      }
    }
    getAccountDetails();
  },[]);
  

  if (auth.login) {
    
    return (
      <div>
        username: {auth.username}<br />
        name: {auth.name}<br />
        email: {auth.email}
      </div>
    );
  } else return (
    <div>not logged in</div>
  );
}

export default User;
