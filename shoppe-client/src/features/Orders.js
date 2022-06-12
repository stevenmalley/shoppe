import { useSelector } from 'react-redux';
import { selectOrders } from './store/orders.js';
import { Link } from 'react-router-dom';

const Orders = () => {

  const orders = useSelector(selectOrders);

  return (
    <div>
      {orders.map((order,i) =>
        <Link key={`order${i}`} className="order-item" to={`/orders/${order.id}`}>
          <div>Order ID: {order.id}, Date: {order.date}</div>
        </Link>
      )}
    </div>
  );
}

export default Orders;
