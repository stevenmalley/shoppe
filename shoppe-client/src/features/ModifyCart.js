import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, getCart, addToCart, modifyCart, removeFromCart } from './store/cart.js';
import { selectAuth, checkLogin } from './store/auth.js';
import './Cart.css';

const ModifyCart = (props) => {

  const auth = useSelector(selectAuth);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();

  function getCartQuantity() {
    let cartProduct = cart.find(product => product.id == props.productID);
    if (cartProduct) return cartProduct.quantity;
    else return 0;
  }
  const cartQuantity = getCartQuantity();

  function addToCartHandler() {
    dispatch(checkLogin()); // log out if session has timed out
    dispatch(addToCart(props.productID,1));
  }

  function modifyCartHandler() {

  }

  function removeFromCartHandler() {
    dispatch(checkLogin()); // log out if session has timed out
    dispatch(removeFromCart(props.productID));
  }

  if (auth.login) {
    return (
      <div className="cart-item-modify">
        in cart: {cartQuantity}
        {(cartQuantity === 0) ?
          <button onClick={addToCartHandler}>add to cart</button> :
          <button onClick={removeFromCartHandler}>remove from cart</button>
        }
      </div>
    );
  } else return <div></div>;
}

export default ModifyCart;
