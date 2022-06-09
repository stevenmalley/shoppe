import { Link } from 'react-router-dom';
import './ProductDetails.css';


export default function ProductDetails(props) {

    return (
        <Link to={`/product/${props.product.id}`} className="productDetails">
            <div className="productName">{props.product.name}</div>
            <div className="productPrice">{props.product.price}</div>
            <div className="productDesc">{props.product.description}</div>
        </Link>
    );
}