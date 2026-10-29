import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loadCart } from "../features/cartSlice";
import { clearUserCart } from "../services/cartStorage";
import { createOrder } from "../services/ordersApi";

import toast from "react-hot-toast";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     TOTAL PRICE
  ========================= */

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  /* =========================
     TOTAL ITEMS
  ========================= */

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity),
    0
  );

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* =========================
     PLACE ORDER
  ========================= */

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/products");
      return;
    }

    setLoading(true);

    try {
      /*
        Keep the shipping address in one object
        so it can be used by Admin Order Details.
      */
      const shippingAddress = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };

      /*
        Create a complete order object.

        Some customer details are stored both inside
        "customer" and at the top level because our
        current Admin Orders page reads the top-level
        fields.
      */
      const order = {
        userId: user.id,

        /* =========================
           CUSTOMER
        ========================= */

        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },

        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,

        /* =========================
           SHIPPING
        ========================= */

        shippingAddress: shippingAddress,

        /*
          Top-level address is kept for compatibility
          with AdminOrderDetails.
        */
        address: shippingAddress,

        /* =========================
           PRODUCTS
        ========================= */

        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image,
          category: item.category
        })),

        /* =========================
           ORDER TOTALS
        ========================= */

        totalItems: totalItems,
        totalAmount: totalPrice,

        /* =========================
           ORDER STATUS
        ========================= */

        status: "Pending",

        /* =========================
           PAYMENT
        ========================= */

        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending",

        /* =========================
           DATE
        ========================= */

        createdAt: new Date().toISOString()
      };

      console.log("Creating order:", order);

      const response = await createOrder(order);

      console.log("Order created:", response.data);

      /* =========================
         CLEAR USER CART
      ========================= */

      clearUserCart(user.id);

      /* =========================
         CLEAR REDUX CART
      ========================= */

      dispatch(loadCart([]));

      toast.success("Order placed successfully!");

      /* =========================
         GO TO ORDERS
      ========================= */

      navigate("/orders");

    } catch (error) {
      console.error("Order error:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EMPTY CART
  ========================= */

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">

        <p className="checkout-label">
          CHECKOUT
        </p>

        <h1>
          Your cart is empty
        </h1>

        <p>
          Add something beautiful to your cart
          before continuing to checkout.
        </p>

        <button
          onClick={() => navigate("/products")}
        >
          Browse Collection
        </button>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="checkout-header">

        <p>
          COMPLETE YOUR ORDER
        </p>

        <h1>
          Checkout
        </h1>

        <span>
          Almost there — let's get your handmade
          pieces ready.
        </span>

      </div>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="checkout-container">

        {/* =========================
            CUSTOMER DETAILS
        ========================= */}

        <div className="checkout-form-section">

          <div className="section-heading">

            <p>
              DELIVERY DETAILS
            </p>

            <h2>
              Where should we send it?
            </h2>

            <span>
              Enter your details so we can prepare
              your order for delivery.
            </span>

          </div>


          <form onSubmit={handlePlaceOrder}>

            {/* Name + Email */}

            <div className="form-row">

              <div className="checkout-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />

              </div>


              <div className="checkout-field">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />

              </div>

            </div>


            {/* Phone */}

            <div className="checkout-field">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                required
              />

            </div>


            {/* Address */}

            <div className="checkout-field">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House name, street, area..."
                rows="4"
                required
              />

            </div>


            {/* City + State */}

            <div className="form-row">

              <div className="checkout-field">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Your city"
                  required
                />

              </div>


              <div className="checkout-field">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Your state"
                  required
                />

              </div>

            </div>


            {/* Pincode */}

            <div className="checkout-field">

              <label>
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength="6"
                required
              />

            </div>


            {/* Payment */}

            <div className="payment-section">

              <p className="payment-label">
                PAYMENT
              </p>

              <h3>
                Payment Method
              </h3>

              <div className="payment-option">

                <div>

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives.
                  </span>

                </div>

                <input
                  type="radio"
                  checked
                  readOnly
                />

              </div>

            </div>


            {/* Mobile Order Button */}

            <button
              type="submit"
              className="mobile-place-order"
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </form>

        </div>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <div className="checkout-summary">

          <div className="summary-top">

            <p>
              YOUR ORDER
            </p>

            <h2>
              Order Summary
            </h2>

          </div>


          {/* Products */}

          <div className="checkout-products">

            {cartItems.map((item) => (

              <div
                className="checkout-product"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="checkout-product-info">

                  <h3>
                    {item.name}
                  </h3>

                  <span>
                    {item.quantity} × ₹{item.price}
                  </span>

                </div>

                <strong>
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            ))}

          </div>


          {/* Price Details */}

          <div className="checkout-prices">

            <div>
              <span>
                Pieces
              </span>

              <span>
                {totalItems}
              </span>
            </div>


            <div>
              <span>
                Subtotal
              </span>

              <span>
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>


            <div>
              <span>
                Shipping
              </span>

              <span>
                Free
              </span>
            </div>

          </div>


          {/* Total */}

          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ₹{totalPrice.toLocaleString("en-IN")}
            </strong>

          </div>


          {/* Desktop Place Order */}

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>


          <p className="checkout-note">
            Your order will be carefully prepared
            and packed with love.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Checkout;