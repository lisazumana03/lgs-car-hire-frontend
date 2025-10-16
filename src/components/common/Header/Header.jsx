import { Link } from "react-router-dom";
import "../../../assets/styling/home.css";

function Header() {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>LG'S CAR HIRE</h1>
          </Link>
        </div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/login" className="nav-link login-btn">Login</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;