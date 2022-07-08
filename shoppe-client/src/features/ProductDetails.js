import ModifyCart from './ModifyCart';
import './ProductDetails.css';
import serverPath from '../serverPath';

export default function ProductDetails(props) {
    
    return (
        <div className="productDetails">
            <div className="productName">{props.product.name}<span>{props.product.author}</span></div>
            <div className="productPrice">{props.product.price}</div>
            <div className="productDesc">{props.product.description}</div>
            <img src={serverPath+`/productImages/${props.product.image}`}  alt={props.product.name} />
            <ModifyCart productID={props.product.id} />
        </div>
    );
}
