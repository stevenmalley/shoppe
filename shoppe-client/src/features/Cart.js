import { useSelector, useDispatch } from 'react-redux';
import { selectCart, purchaseCart } from './store/cart.js';
import { Link } from 'react-router-dom';
import ModifyCart from './ModifyCart';
import './Cart.css';

const Cart = () => {

  const cart = useSelector(selectCart);
  const dispatch = useDispatch();

  function purchaseHandler() {
    dispatch(purchaseCart());
  }

  return (
    cart.length === 0 ?
        "cart empty" :
        <div>
          {cart.map((product,i) =>
            <div key={`cartProduct${i}`} className="cart-item">
              <Link to={`/product/${product.id}`} className="cart-item-link">
                <div>{product.name}</div>
                <div>{product.price}</div>
              </Link>
              <ModifyCart productID={product.id} />
            </div>)}
          <button onClick={purchaseHandler}>BUY</button>
        </div>
  );
}

export default Cart;
