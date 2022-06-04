import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveWelcome, selectHome } from './store/home.js';

export default function Home() {

    const home = useSelector(selectHome);
    const dispatch = useDispatch();


    useEffect(()=>{
        async function getWelcome () {
            await dispatch(retrieveWelcome());
        }
        getWelcome();
    },[]);
    

    return <div>{home.message}</div>;
}
