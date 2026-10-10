import { Link, useNavigate } from "react-router-dom";
import type { Me } from "../types/types";

interface NavbarProps {
  user: Me | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();

  function handleProductClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/product");
  }

  function handleAuthClick(e: React.MouseEvent) {
    if (user) {
      e.preventDefault();
      onLogout();
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-mark">
          <span>Resume</span>Review
        </Link>

        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <a href="/product" onClick={handleProductClick}>Product</a>
          <a href="/contact">Contact</a>
        </nav>

        <div className="navbar-auth">
          {user ? (
            <button className="btn btn-line" onClick={handleAuthClick}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn btn-line">Login</Link>
              <Link to="/signup" className="btn btn-primary navbar-cta">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}