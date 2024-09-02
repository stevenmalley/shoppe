import { Link } from 'react-router-dom';
import './ProductTile.css';
import serverPath from '../serverPath';


export default function ProductTile(props) {

    return (
        <Link to={`/product/${props.product.id}`} className="productTile">
            <div>
              <div className="productName">{props.product.name}</div>
              <div className="productDesc">{props.product.description}</div>
            </div>
            <img src={serverPath+`/productImages/${props.product.image}.jpg`}  alt={props.product.name} />
            <div className="productPrice">{props.product.price}</div>
        </Link>
    );
}