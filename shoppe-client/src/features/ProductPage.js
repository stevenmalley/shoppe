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
        async function getProduct() {
            await dispatch(getOneProduct(productID));
        }
        getProduct();
    },[]);

    if (product.products.length > 0) {
        return <div>{product.products.map(prod => <ProductDetails key={"productID"+prod.id} 
                                                                    name={prod.name}
                                                                    description={prod.description}
                                                                    price={prod.price} />)}</div>;
    } else return <div>product {productID}</div>;
}
