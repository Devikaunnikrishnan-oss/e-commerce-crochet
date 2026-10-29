import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import "./AdminOrderDetails.css";

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("Pending");
  const [updating, setUpdating] = useState(false);


  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${id}`);

      setOrder(response.data);

      setStatus(response.data.status || "Pending");
    } catch (error) {
      console.error("Failed to load order:", error);

      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);


  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);

      const response = await api.patch(
        `/orders/${id}`,
        {
          status: status,
        }
      );

      setOrder(response.data);

      toast.success(
        `Order status updated to ${status}`
      );
    } catch (error) {
      console.error(
        "Failed to update status:",
        error
      );

      toast.error(
        "Failed to update order status."
      );
    } finally {
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="admin-order-details-page">
        <div className="order-details-loading">
          Loading order details...
        </div>
      </div>
    );
  }


  if (error || !order) {
    return (
      <div className="admin-order-details-page">
        <div className="order-details-error">
          <p>
            {error || "Order not found."}
          </p>

          <button
            className="back-orders-btn"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }


  const customer = order.customer || {};

  const address =
    order.shippingAddress || {};

  const items = order.items || [];

  const totalItems =
    order.totalItems ??
    items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  const totalAmount = Number(
    order.totalAmount ??
      order.total ??
      order.amount ??
      0
  );

  const customerName =
    customer.name ||
    order.customerName ||
    "Customer";

  const customerEmail =
    customer.email ||
    order.email ||
    "No email";

  const customerPhone =
    customer.phone ||
    order.phone ||
    "No phone";

  

  const orderDate = order.createdAt
    ? new Date(
        order.createdAt
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Date unavailable";

  return (
    <div className="admin-order-details-page">

     

      <div className="order-details-header">

        <button
          className="back-orders-btn"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          ← Back to Orders
        </button>

        <div className="order-heading">

          <div>

            <span className="page-eyebrow">
              ORDER DETAILS
            </span>

            <h1>
              #{order.id}
            </h1>

            <p>
              Placed on {orderDate}
            </p>

          </div>
         

          <div className="order-status-control">

            <label>
              ORDER STATUS
            </label>

            <div className="status-control-row">

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Processing">
                  Processing
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>

              <button
                onClick={handleUpdateStatus}
                disabled={
                  updating ||
                  status === order.status
                }
              >
                {updating
                  ? "Updating..."
                  : "Update"}
              </button>

            </div>

          </div>

        </div>

      </div>



      <div className="order-details-grid">

       
        <section className="order-details-card">

          <div className="card-heading">

            <span>01</span>

            <div>

              <small>
                CUSTOMER
              </small>

              <h2>
                Customer Information
              </h2>

            </div>

          </div>


          <div className="customer-details">

            <div className="large-avatar">
              {customerName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {customerName}
              </strong>

              <p>
                {customerEmail}
              </p>

              <p>
                {customerPhone}
              </p>

            </div>

          </div>

        </section>


        <section className="order-details-card">

          <div className="card-heading">

            <span>02</span>

            <div>

              <small>
                SUMMARY
              </small>

              <h2>
                Order Summary
              </h2>

            </div>

          </div>


          <div className="summary-row">

            <span>
              Total Items
            </span>

            <strong>
              {totalItems}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Payment Method
            </span>

            <strong>
              {order.paymentMethod ||
                "Cash on Delivery"}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Payment Status
            </span>

            <strong>
              {order.paymentStatus ||
                "Pending"}
            </strong>

          </div>


          <div className="summary-total">

            <span>
              Total Amount
            </span>

            <strong>
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </section>



        <section className="order-details-card order-items-card">

          <div className="card-heading">

            <span>03</span>

            <div>

              <small>
                PRODUCTS
              </small>

              <h2>
                Ordered Products
              </h2>

            </div>

          </div>


          <div className="order-items">

            {items.length === 0 ? (

              <p className="no-items">
                No products found in this
                order.
              </p>

            ) : (

              items.map((item, index) => {

                const quantity =
                  Number(
                    item.quantity || 1
                  );

                const price =
                  Number(
                    item.price || 0
                  );

                const itemTotal =
                  price * quantity;

                return (
                  <div
                    className="order-item"
                    key={
                      item.id ||
                      `${item.name}-${index}`
                    }
                  >

                    

                    <div className="order-item-image">

                      {item.image ? (

                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <span>
                          No image
                        </span>

                      )}

                    </div>


                    <div className="order-item-info">

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        Quantity: {quantity}
                      </span>

                    </div>


                    <div className="order-item-price">

                      ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </section>



        <section className="order-details-card">

          <div className="card-heading">

            <span>04</span>

            <div>

              <small>
                DELIVERY
              </small>

              <h2>
                Delivery Address
              </h2>

            </div>

          </div>


          <div className="address-details">

            <p>
              <strong>
                {customerName}
              </strong>
            </p>

            <p>
              {address.address ||
                "Address not available"}
            </p>

            <p>
              {address.city || ""}
              {address.city &&
              address.state
                ? ", "
                : ""}
              {address.state || ""}
            </p>

            <p>
              PIN:{" "}
              {address.pincode ||
                "N/A"}
            </p>

            <p>
              Phone: {customerPhone}
            </p>

          </div>

        </section>


        
        <section className="order-details-card">

          <div className="card-heading">

            <span>05</span>

            <div>

              <small>
                PAYMENT
              </small>

              <h2>
                Payment Information
              </h2>

            </div>

          </div>


          <div className="summary-row">

            <span>
              Method
            </span>

            <strong>
              {order.paymentMethod ||
                "Cash on Delivery"}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Status
            </span>

            <strong>
              {order.paymentStatus ||
                "Pending"}
            </strong>

          </div>


          <div className="summary-total">

            <span>
              Order Total
            </span>

            <strong>
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </section>

      </div>

    </div>
  );
}

export default AdminOrderDetails;