import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProducts, selectProducts } from './store/product.js';
import ProductTile from './ProductTile';

export default function Products() {

    const products = useSelector(selectProducts);
    const dispatch = useDispatch();

    useEffect(()=>{dispatch(getAllProducts())},[]);

    if (products.length > 0) {
        return <div id="productsDisplay">{products.map(prod => <ProductTile key={"productID"+prod.id} product={prod} />)}</div>;
    } else return <div>products</div>;
}
