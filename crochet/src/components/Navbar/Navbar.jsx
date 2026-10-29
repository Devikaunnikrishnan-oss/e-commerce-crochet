
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../../features/authSlice";
import { clearCart } from "../../features/cartSlice";
import { clearWishlist } from "../../features/wishlistSlice";

import { clearUserCart } from "../../services/cartStorage";
import { clearUserWishlist } from "../../services/WishlistStorage";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const cartItems = useSelector(
    (state) => state.cart.items || []
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items || []
  );

  const handleLogout = () => {
    if (user) {
      clearUserCart(user.id);
      clearUserWishlist(user.id);
    }

    dispatch(clearCart());
    dispatch(clearWishlist());
    dispatch(logoutUser());

    navigate("/login", { replace: true });
  };

  return (
    <header className="store-navbar">
      <div
        className="store-logo"
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
      >
        <span className="logo-main">CROCHET</span>
        <span className="logo-sub">STORE</span>
      </div>

      <nav className="store-nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          Shop
        </NavLink>

        <button
          type="button"
          className="nav-link"
          onClick={() => {
            if (window.location.pathname !== "/") {
              navigate("/#about");
            } else {
              document.getElementById("about")?.scrollIntoView({
                behavior: "smooth"
              });
            }
          }}
        >
          About
        </button>

        <button
          type="button"
          className="nav-link"
          onClick={() => {
            if (window.location.pathname !== "/") {
              navigate("/#contact");
            } else {
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth"
              });
            }
          }}
        >
          Contact
        </button>
      </nav>

      <div className="navbar-actions">
        <button
          type="button"
          className="nav-icon-button"
          onClick={() => navigate("/wishlist")}
          aria-label="Wishlist"
        >
          ♡
          {wishlistItems.length > 0 && (
            <span className="nav-count">
              {wishlistItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          className="nav-icon-button"
          onClick={() => navigate("/cart")}
          aria-label="Cart"
        >
          ♧
          {cartItems.length > 0 && (
            <span className="nav-count">
              {cartItems.length}
            </span>
          )}
        </button>

        {user ? (
          <button
            type="button"
            className="nav-user-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `nav-link auth-nav-link ${isActive ? "active" : ""}`
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="nav-register-button"
            >
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;