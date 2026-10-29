import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getOrders } from "../services/ordersApi";

import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH USER ORDERS
  ========================= */

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await getOrders();

        const allOrders = response.data;

        // Show only the logged-in user's orders
        const userOrders = allOrders.filter(
          (order) => order.userId === user.id
        );

        // Latest order first
        userOrders.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

        setOrders(userOrders);
      } catch (error) {
        console.error("Orders error:", error);

        setError(
          "Unable to load your orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  /* =========================
     NOT LOGGED IN
  ========================= */

  if (!user) {
    return (
      <div className="orders-empty">

        <p className="orders-label">
          YOUR ORDERS
        </p>

        <h1>Please login first</h1>

        <p>
          Login to view your orders and track
          your handmade purchases.
        </p>

        <button
          onClick={() => navigate("/login")}
        >
          Login
        </button>

      </div>
    );
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="orders-status">
        <p>Loading your orders...</p>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="orders-status">

        <p className="orders-error">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>

      </div>
    );
  }

  /* =========================
     EMPTY ORDERS
  ========================= */

  if (orders.length === 0) {
    return (
      <div className="orders-empty">

        <p className="orders-label">
          YOUR ORDERS
        </p>

        <h1>No orders yet</h1>

        <p>
          Your handmade collection is waiting
          for you. Explore our creations and
          find something special.
        </p>

        <button
          onClick={() => navigate("/products")}
        >
          Explore Collection
        </button>

      </div>
    );
  }

  /* =========================
     ORDERS PAGE
  ========================= */

  return (
    <div className="orders-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="orders-header">

        <p>
          YOUR ORDERS
        </p>

        <h1>
          My Orders
        </h1>

        <span>
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}{" "}
          placed
        </span>

      </div>


      {/* =========================
          ORDERS LIST
      ========================= */}

      <div className="orders-container">

        {orders.map((order) => (

          <div
            className="order-card"
            key={order.id}
          >

            {/* =========================
                ORDER HEADER
            ========================= */}

            <div className="order-top">

              <div>

                <p className="order-small-label">
                  ORDER
                </p>

                <h2>
                  #{order.id}
                </h2>

                <span className="order-date">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }
                  )}
                </span>

              </div>


              <div className="order-status">

                <span
                  className={`status-dot ${String(
                    order.status || "Placed"
                  ).toLowerCase().replace(/\s+/g, "-")}`}
                ></span>

                <span>
                  {order.status || "Placed"}
                </span>

              </div>

            </div>


            {/* =========================
                ORDER ITEMS
            ========================= */}

            <div className="order-items">

              {order.items?.map((item) => (

                <div
                  className="order-item"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="order-item-info">

                    <p className="order-category">
                      {item.category}
                    </p>

                    <h3>
                      {item.name}
                    </h3>

                    <span>
                      Quantity: {item.quantity}
                    </span>

                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>

                </div>

              ))}

            </div>


            {/* =========================
                DELIVERY DETAILS
            ========================= */}

            <div className="order-details">

              <div className="order-detail-block">

                <p>
                  DELIVERY ADDRESS
                </p>

                <span>
                  {order.customer?.name}
                </span>

                <span>
                  {order.shippingAddress?.address}
                </span>

                <span>
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state}
                </span>

                <span>
                  PIN: {order.shippingAddress?.pincode}
                </span>

                <span>
                  Phone: {order.customer?.phone}
                </span>

              </div>


              <div className="order-detail-block">

                <p>
                  PAYMENT
                </p>

                <span>
                  {order.paymentMethod ||
                    "Cash on Delivery"}
                </span>

              </div>

            </div>


            {/* =========================
                ORDER TOTAL
            ========================= */}

            <div className="order-bottom">

              <div>

                <span>
                  {order.totalItems}{" "}
                  {order.totalItems === 1
                    ? "piece"
                    : "pieces"}
                </span>

              </div>

              <div className="order-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹{order.totalAmount}
                </strong>

              </div>

            </div>

          </div>

        ))}


        {/* =========================
            CONTINUE SHOPPING
        ========================= */}

        <button
          className="orders-shopping-btn"
          onClick={() => navigate("/products")}
        >
          ← Continue Shopping
        </button>

      </div>

    </div>
  );
}

export default Orders;