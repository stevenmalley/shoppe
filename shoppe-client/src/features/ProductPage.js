import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOneProduct, selectProducts } from './store/product.js';
import ProductDetails from './ProductDetails';

export default function ProductPage() {

    const product = useSelector(selectProducts);
    const dispatch = useDispatch();

    const productID = useParams().productId;

    useEffect(()=>{
        dispatch(getOneProduct(productID));
    },[]);

    if (product.length > 0 && product[0].id == productID) {
        return <ProductDetails product={product[0]} />;
    } else return <div>product {productID}</div>;
}
