import { useSelector, useDispatch } from 'react-redux';
import { selectOrders, getOrder } from './store/orders.js';
import { selectProducts, getOneProduct } from './store/product.js';
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
    if (order.sales) {
      for (const sale of order.sales) {
        if (!product.some(p => p.id == sale.product_id)) dispatch(getOneProduct(sale.product_id));
      }
    }
  },[orders]);

  return (
    <div>
      <div>Order ID: {orderID}</div>
      <div>Date: {order.datetime}</div>
      {order.sales ?
        order.sales.map((sale,i) => {
          const saleProduct = product.find(p => p.id == sale.product_id);
          if (saleProduct) return <Link key={`sale${i}`} to={`/product/${sale.product_id}`} style={{display:"block",marginTop:10}}>{saleProduct.name} ({sale.quantity})</Link>;
        }) : ""}
    </div>
  );
}

export default Order;
