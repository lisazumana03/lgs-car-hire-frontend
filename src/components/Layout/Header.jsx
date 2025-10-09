import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/home.css";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" onClick={closeMobileMenu} aria-label="LG'S CAR HIRE Home">
            <h1>LG'S CAR HIRE</h1>
          </Link>
        </div>

        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Contact
          </Link>
          <Link
            to="/login"
            className={`nav-link nav-cta ${isActive('/login') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Login
          </Link>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        ></div>
      )}
    </header>
  );
}

export default Header;