import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOneProduct, selectProducts } from './store/product.js';
import ProductDetails from './ProductDetails';

export default function ProductPage() {

    const products = useSelector(selectProducts);
    const dispatch = useDispatch();

    const productID = useParams().productId;
    const product = products.find(p => p.id == productID);

    useEffect(()=>{
        dispatch(getOneProduct(productID));
    },[]);

    if (product) {
        return <ProductDetails product={product} />;
    } else return <div>product {productID}</div>;
}
