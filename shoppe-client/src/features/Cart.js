import { useSelector } from 'react-redux';
import { selectCart } from './store/cart.js';
import { Link } from 'react-router-dom';
import ModifyCart from './ModifyCart';
import './Cart.css';

const Cart = () => {

  const cart = useSelector(selectCart);

  return (
    <div>
      {cart.length === 0 ?
        "cart empty" :
        cart.map((product,i) =>
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
