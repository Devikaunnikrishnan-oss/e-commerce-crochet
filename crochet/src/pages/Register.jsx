
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUsers, registerUser } from "../services/authApi";
import { toast } from "react-hot-toast";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  // Register a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name || !email || !password.trim()) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // Get existing users
      const response = await getUsers();
      const users = response.data;

      // Check whether email already exists
      const existingUser = users.find(
        (user) =>
          user.email?.trim().toLowerCase() === email
      );

      if (existingUser) {
        setError("An account with this email already exists.");
        toast.error("An account with this email already exists.");
        return;
      }

      // Save the new user
      await registerUser({
        name,
        email,
        password,
        role: "user"
      });

      toast.success("Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user"
      });

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      setError("Registration failed. Please try again.");
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-box">
        <div className="register-brand">
          <span className="register-brand-line"></span>
          <span>CROCHETSTORE</span>
          <span className="register-brand-line"></span>
        </div>

        <p className="register-subtitle">
          HANDMADE WITH LOVE
        </p>

        <h1>Create Account</h1>

        <p className="register-description">
          Join us and discover something beautifully handmade.
        </p>

        {error && (
          <p className="register-error" role="alert">
            {error}
          </p>
        )}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <div className="register-form-group">
            <label htmlFor="register-name">
              Full Name
            </label>

            <input
              id="register-name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="register-email">
              Email Address
            </label>

            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="register-divider">
          <span></span>
          <span>OR</span>
          <span></span>
        </div>

        <p className="register-login-text">
          Already have an account?{" "}
          <Link
            to="/login"
            className="register-login-link"
          >
            Login
          </Link>
        </p>

        <p className="register-footer">
          Crafted with care, made to be cherished.
        </p>
      </section>
    </main>
  );
}

export default Register;