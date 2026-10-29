import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  loadCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart
} from "../features/cartSlice";

import {
  getCart,
  saveCart
} from "../services/cartStorage";

import "./Cart.css";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const [cartItems, setCartItems] = useState([]);

  /* =========================
     LOAD CART
  ========================= */

  useEffect(() => {
    if (!user) return;

    const savedCart = getCart(user.id);

    setCartItems(savedCart);
    dispatch(loadCart(savedCart));
  }, [user, dispatch]);

  /* =========================
     INCREASE QUANTITY
  ========================= */

  const handleIncrease = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1
          }
        : item
    );

    setCartItems(updatedCart);
    saveCart(user.id, updatedCart);

    dispatch(increaseQuantity(id));
  };

  /* =========================
     DECREASE QUANTITY
  ========================= */

  const handleDecrease = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? {
            ...item,
            quantity: item.quantity - 1
          }
        : item
    );

    setCartItems(updatedCart);
    saveCart(user.id, updatedCart);

    dispatch(decreaseQuantity(id));
  };

  /* =========================
     REMOVE ITEM
  ========================= */

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== id
    );

    setCartItems(updatedCart);
    saveCart(user.id, updatedCart);

    dispatch(removeFromCart(id));
  };

  /* =========================
     TOTAL ITEMS
  ========================= */

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /* =========================
     TOTAL PRICE
  ========================= */

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  /* =========================
     EMPTY CART
  ========================= */

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">

        <div className="empty-cart-content">

          <p className="empty-cart-label">
            YOUR SHOPPING BAG
          </p>

          <h1>Your Cart is Empty</h1>

          <p className="empty-cart-text">
            Your handmade collection is waiting for you.
            Discover something special and bring a little
            warmth into your everyday moments.
          </p>

          <button
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  /* =========================
     CART PAGE
  ========================= */

  return (
    <div className="cart-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="cart-header">

        <p>YOUR SHOPPING BAG</p>

        <h1>Your Cart</h1>

        <span>
          {totalItems}{" "}
          {totalItems === 1 ? "piece" : "pieces"} selected
        </span>

      </div>


      {/* =========================
          MAIN CART CONTAINER
      ========================= */}

      <div className="cart-container">


        {/* =========================
            CART ITEMS
        ========================= */}

        <div className="cart-items">

          {cartItems.map((item) => (

            <div
              className="cart-item"
              key={item.id}
            >

              {/* Product Image */}

              <img
                src={item.image}
                alt={item.name}
              />


              {/* Product Information */}

              <div className="cart-item-info">

                <p className="cart-category">
                  {item.category}
                </p>

                <h2>
                  {item.name}
                </h2>

                <p className="cart-price">
                  ₹{item.price}
                </p>


                {/* Quantity + Remove */}

                <div className="cart-bottom">

                  <div className="cart-quantity">

                    <button
                      onClick={() =>
                        handleDecrease(item.id)
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleIncrease(item.id)
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                  </div>


                  <button
                    className="remove-btn"
                    onClick={() =>
                      handleRemove(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>


              {/* Item Total */}

              <div className="item-total">
                ₹{item.price * item.quantity}
              </div>

            </div>

          ))}


          {/* Continue Shopping */}

          <button
            className="continue-shopping"
            onClick={() => navigate("/products")}
          >
            ← Continue Shopping
          </button>


          {/* =========================
              CART INFORMATION
          ========================= */}

          <div className="cart-info-section">

            <div className="cart-info-item">

              <h3>
                Handmade with care
              </h3>

              <p>
                Every piece is carefully crafted
                with attention to detail and a
                personal touch.
              </p>

            </div>


            <div className="cart-info-item">

              <h3>
                Made for meaningful moments
              </h3>

              <p>
                Thoughtful handmade creations
                designed for gifting, celebrating
                and everyday joy.
              </p>

            </div>


            <div className="cart-info-item">

              <h3>
                Simple & secure
              </h3>

              <p>
                Review your pieces and continue
                to checkout whenever you're ready.
              </p>

            </div>

          </div>

        </div>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <div className="cart-summary">

          <p className="summary-label">
            ORDER SUMMARY
          </p>

          <h2>
            Your Order
          </h2>


          {/* Items */}

          <div className="summary-row">

            <span>
              Pieces
            </span>

            <span>
              {totalItems}
            </span>

          </div>


          {/* Subtotal */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹{totalPrice}
            </span>

          </div>


          {/* Shipping */}

          <div className="summary-row">

            <span>
              Shipping
            </span>

            <span>
              Free
            </span>

          </div>


          {/* Total */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <span>
              ₹{totalPrice}
            </span>

          </div>


          {/* Checkout */}

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>


          {/* Small Message */}

          <p className="secure-text">
            Handmade with care · Secure checkout
          </p>

        </div>

      </div>

    </div>
  );
}

export default Cart;