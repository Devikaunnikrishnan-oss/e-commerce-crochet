

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { getUsers } from "../services/authApi";

import { loginUser } from "../features/authSlice";
import { loadCart } from "../features/cartSlice";
import { loadWishlist } from "../features/wishlistSlice";

import { getCart } from "../services/cartStorage";
import { getWishlist } from "../services/WishlistStorage";

import "./Login.css";
import toast from "react-hot-toast";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  // Redirect if already logged in
  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await getUsers();
      const users = response.data;

      const loggedInUser = users.find(
        (user) =>
          user.email.toLowerCase().trim() ===
            formData.email.toLowerCase().trim() &&
          user.password === formData.password
      );

      if (!loggedInUser) {
        setError("Invalid email or password.");
        return;
      }

      if (loggedInUser.isBlocked) {
        setError("Your account has been blocked by the admin.");
        return;
      }

      dispatch(loginUser(loggedInUser));

      // Load the logged-in user's cart
      try {
        const savedCart = getCart(loggedInUser.id);
        dispatch(loadCart(savedCart));
      } catch (cartError) {
        console.error("Cart loading error:", cartError);
        dispatch(loadCart([]));
      }

      // Load the logged-in user's wishlist
      try {
        const savedWishlist = getWishlist(loggedInUser.id);
        dispatch(loadWishlist(savedWishlist));
      } catch (wishlistError) {
        console.error("Wishlist loading error:", wishlistError);
        dispatch(loadWishlist([]));
      }

      setFormData({
        email: "",
        password: ""
      });

      toast.success("Login successful");

      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className="login-error">{error}</p>
          )}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* Register link */}
        <p className="register-prompt">
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;