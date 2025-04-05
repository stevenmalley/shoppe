import { NavLink } from 'react-router-dom';
import serverPath from '../serverPath';

function Header() {

  return (
    <header className="shoppeHeader">
      
        <div id="headerTitle">
          <NavLink to="/">
            <div id="headerImage">
              <img src={`${serverPath}/productImages/books.png`} />
              <h2>ye olde online shoppe</h2>
            </div>
          </NavLink>
          <div id="headings">
            <NavLink to="/">
              <h1>Welcome to Shoppe</h1>
            </NavLink>
            <div>
              <NavLink className={({isActive})=>isActive ? "navigation navigation-active" : "navigation"} to="/">HOME</NavLink>
              <NavLink className={({isActive})=>isActive ? "navigation navigation-active" : "navigation"} to="/product" end>PRODUCTS</NavLink>
            </div>
          </div>
        </div>
    </header>
  );
}

export default Header;