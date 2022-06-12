import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, getCart } from './store/cart.js';
import { Link } from 'react-router-dom';
import ModifyCart from './ModifyCart';
import './Cart.css';

const Cart = () => {

  const cart = useSelector(selectCart);
  const dispatch = useDispatch();

  return (
    <div>
      {cart.map((product,i) =>
        <div key={`cartProduct${i}`} className="cart-item">
          <Link to={`/product/${product.id}`} className="cart-item-link">
            <div>{product.name}</div>
            <div>{product.price}</div>
          </Link>
          <ModifyCart productID={product.id} />
        </div>
      )}
    </div>
  );
}

export default Cart;
