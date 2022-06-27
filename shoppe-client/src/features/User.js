import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserAccount, checkLogin, selectAuth } from './store/auth.js';

const User = () => {

  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  const userID = useParams().userID;

  useEffect(() => {
    dispatch(checkLogin());
    if (auth.login) {
      dispatch(getUserAccount(auth.username));
    }
  },[auth.login]);
  

  if (auth.login && auth.username === userID) {
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
