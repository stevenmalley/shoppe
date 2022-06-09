import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveWelcome, selectHome } from './store/home.js';

export default function Home() {

    const home = useSelector(selectHome);
    const dispatch = useDispatch();

    useEffect(()=>{dispatch(retrieveWelcome())},[]);
    
    return <div>{home.message}</div>;
}
