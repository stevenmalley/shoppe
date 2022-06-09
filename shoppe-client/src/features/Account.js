import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserAccount, selectAuth } from './store/auth.js';

const Account = () => {

  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  useEffect(()=>{dispatch(getUserAccount(auth.username))},[]);

  return (
    <div>
      username: {auth.username}<br />
      name: {auth.name}<br />
      email: {auth.email}<br />
    </div>
  );
};

export default Account;