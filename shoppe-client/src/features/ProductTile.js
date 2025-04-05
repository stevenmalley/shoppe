import { Link } from 'react-router-dom';
import './ProductTile.css';
import serverPath from '../serverPath';


export default function ProductTile(props) {

  function handleMouseEnter(e) {
    e.currentTarget.classList.add("focusedTile");
  }

  function handleMouseLeave(e) {
    e.currentTarget.classList.remove("focusedTile");
  }

    return (
        <Link to={`/product/${props.product.id}`} className="productTile" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div>
              <div>
                <img src={serverPath+`/productImages/${props.product.image}.jpg`}  alt={props.product.name} />
              </div>
              <div>
                <div className="productName">{props.product.name}</div>
                <div className="productDesc">{props.product.description}</div>
              </div>
            </div>
            <div className="productPrice">{props.product.price}</div>
        </Link>
    );
}