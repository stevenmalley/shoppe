import { NavLink } from 'react-router-dom';
import serverPath from '../serverPath';

function Header() {

  return (
    <header className="shoppeHeader">
      <NavLink to="/">
        <div id="headerTitle">
          <div id="headerImage">
            <img src={`${serverPath}/productImages/books`} />
          </div>
          <div id="headings">
            <h1>Welcome to Shoppe</h1>
            <h2>ye olde online shoppe</h2>
          </div>
        </div>
      </NavLink>
      <div>
        <NavLink className={({isActive})=>isActive ? "navigation navigation-active" : "navigation"} to="/">HOME</NavLink>
        <NavLink className={({isActive})=>isActive ? "navigation navigation-active" : "navigation"} to="/product" end>PRODUCTS</NavLink>
      </div>
    </header>
  );
}

export default Header;