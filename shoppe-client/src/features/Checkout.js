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
      dispatch(purchaseCart());
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <PaymentElement id="shoppeStripe" />
        <button id="buyButton" disabled={!stripe}>BUY</button>
      </form>
  );

}

export default Checkout;
