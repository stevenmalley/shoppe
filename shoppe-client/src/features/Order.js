import { useSelector, useDispatch } from 'react-redux';
import { selectOrders, getOrder } from './store/orders.js';
import { selectProducts, getAllProducts } from './store/product.js';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const Order = () => {

  const orders = useSelector(selectOrders);
  const orderID = useParams().orderID;
  const order = orders.find(o => o.id == orderID);

  const product = useSelector(selectProducts);

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getOrder(orderID));
  },[]);

  useEffect(()=>{
    if (order.sales && order.sales.some(sale => !product.find(p => p.id == sale.product_id))) {
      dispatch(getAllProducts());
    }
  },[orders]);

  return (
    <div>
      <div>Order ID: {orderID}</div>
      <div>Date: {order.date}</div>
      {order.sales && product.length > 0 ? order.sales.map((sale,i) => {
        const saleProduct = product.find(p => p.id == sale.product_id);
        return <div>{saleProduct.name} ({sale.quantity})</div>;
      }) : ""}
    </div>
  );
}

export default Order;
