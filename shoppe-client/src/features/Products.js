import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProducts, selectProducts } from './store/product.js';
import ProductDetails from './ProductDetails';

export default function Products() {

    const product = useSelector(selectProducts);
    const dispatch = useDispatch();


    useEffect(()=>{
        async function getProducts() {
            await dispatch(getAllProducts());
        }
        getProducts();
    },[]);

    if (product.products.length > 0) {
        return <div>{product.products.map(prod => <ProductDetails key={"productID"+prod.id}
                                                                    name={prod.name}
                                                                    description={prod.description}
                                                                    price={prod.price} />)}</div>;
    } else return <div>products</div>;
}
