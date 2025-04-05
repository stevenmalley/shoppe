import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveWelcome, selectHome } from './store/home.js';

export default function Home() {

    const home = useSelector(selectHome);
    const dispatch = useDispatch();

    useEffect(()=>{dispatch(retrieveWelcome())},[]);
    
    return <div>
            <p>{home.message}</p>
            <p>This is for <strong>demonstration purposes only</strong>.</p>
            <p>You can create a user account or sign in with Google.</p>
            <p>Click <NavLink to="/product">Products</NavLink> to see items and add them to your cart.</p>
            <p>Use the credit card number 4000056655665556 to do a test purchase (Stripe.js).</p>
            <p>See the code on <a href="https://github.com/stevenmalley/shoppe">Github</a>.</p>
          </div>;
}
