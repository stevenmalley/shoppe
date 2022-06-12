import { NavLink } from 'react-router-dom';

function Header() {

  return (
    <header>
      <h1>Welcome to Shoppe</h1>
      <h2>knick-knacks, curios, objets d'art, trinkets</h2>
      <NavLink className={({isActive})=>isActive ? "navigation navigation-active" : "navigation"} to="/">HOME</NavLink>
      <NavLink className={({isActive})=>isActive ? "navigation navigation-active" : "navigation"} to="/product" end>PRODUCTS</NavLink>
    </header>
  );
}

export default Header;