import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogin, selectAuth } from './store/auth';

export default function PrivateRoute(props) {

    const navigate = useNavigate();
    const auth = useSelector(selectAuth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkLogin());
    });

    useEffect(() => {
        if (auth.login === false) {
            navigate("/login");
        }
    },[auth]);

    return (
        auth.login ? props.component :
        <div>checking login details...</div>
    );
}
