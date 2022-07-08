//import { useDispatch } from 'react-redux';
//import { purchaseCart } from './store/cart.js';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCart } from './store/cart.js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Checkout from './Checkout';
import serverPath from '../serverPath';
import './Cart.css';


const stripePromise = loadStripe('pk_test_51LJDsuEAyHGdNsJorHh6w9hfyXnnz6faUMPu8WimEQraeEqsny9XReMsEf5XhzfjRdMkPpZiaB8wCKp445Vlhav600rRSuo1uz');


const Stripe = () => {
  const [ stripeOptions, setStripeOptions ] = useState({});

  const cart = useSelector(selectCart);

  useEffect(() => {
    async function initialise() {
      const response = await fetch(serverPath+"/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      const { clientSecret } = await response.json();
      setStripeOptions({clientSecret});
    }
    initialise();
  },[cart]);

  return stripeOptions.clientSecret ?
      <Elements stripe={stripePromise} options={stripeOptions}>
        <Checkout />
      </Elements> 
    : "loading...";

/*
  const dispatch = useDispatch();

  async function purchaseHandler() {
    dispatch(purchaseCart());
  }
  
  return (
    <div>
      <PaymentElement />
      <button onClick={purchaseHandler}>BUY</button>
    </div>
  );
*/

}

export default Stripe;
