import { Link } from 'react-router-dom';
import './ProductTile.css';


export default function ProductTile(props) {

    return (
        <Link to={`/product/${props.product.id}`} className="productTile">
            <div className="productName">{props.product.name}</div>
            <div className="productDesc">{props.product.description}</div>
            <div className="productPrice">{props.product.price}</div>
            <img src={`/productImages/${props.product.image}`}  alt={props.product.name} />
        </Link>
    );
}