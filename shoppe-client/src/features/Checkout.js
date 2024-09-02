import { useDispatch } from 'react-redux';
import { purchaseCart } from './store/cart';
import { useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import './Cart.css';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: new URL(window.location.href).origin,
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`.
      console.log(result);
      dispatch(purchaseCart(result.paymentIntent.client_secret));
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <div style={{color:"red",fontSize:"0.8em",marginTop:30}}>Please do not use real card details. Use this false number for testing.</div>
        <div style={{color:"grey",fontSize:"0.8em",marginTop:5}}>test number: 4000056655665556</div>
        <PaymentElement id="shoppeStripe" />
        <button id="buyButton" disabled={!stripe}>BUY</button>
      </form>
  );

}

export default Checkout;
