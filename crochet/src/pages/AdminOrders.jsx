import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../services/ordersApi";
import "./AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const ordersPerPage = 8;


  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders();

      setOrders(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      );

      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  

  const getCustomerName = (order) => {
    return (
      order.customer?.name ||
      order.customerName ||
      order.userName ||
      order.user?.name ||
      "Customer"
    );
  };

  const getCustomerEmail = (order) => {
    return (
      order.customer?.email ||
      order.email ||
      "—"
    );
  };

  const getOrderTotal = (order) => {
    return Number(
      order.totalAmount ??
        order.total ??
        order.amount ??
        0
    );
  };

  const getOrderStatus = (order) => {
    return order.status || "Pending";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };


  const filteredOrders = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    return orders.filter((order) => {
      const customerName =
        getCustomerName(order).toLowerCase();

      const customerEmail =
        getCustomerEmail(order).toLowerCase();

      const orderId =
        String(order.id).toLowerCase();

      const status =
        getOrderStatus(order).toLowerCase();

      const matchesSearch =
        customerName.includes(searchText) ||
        customerEmail.includes(searchText) ||
        orderId.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);


  const totalPages = Math.ceil(
    filteredOrders.length /
      ordersPerPage
  );

  const startIndex =
    (currentPage - 1) *
    ordersPerPage;

  const currentOrders =
    filteredOrders.slice(
      startIndex,
      startIndex + ordersPerPage
    );

  
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="orders-loading">
          Loading orders...
        </div>
      </div>
    );
  }

  

  if (error) {
    return (
      <div className="admin-orders-page">
        <div className="orders-error">
          <p>{error}</p>

          <button onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">

     

      <div className="admin-orders-header">

        <div>
          <p className="admin-orders-eyebrow">
            ORDER MANAGEMENT
          </p>

          <h1>Orders</h1>

          <p>
            View and manage customer orders.
          </p>
        </div>

        <div className="admin-orders-count">
          {orders.length} orders
        </div>

      </div>


     
      <div className="admin-orders-toolbar">

        <input
          type="text"
          placeholder="Search by order ID, name or email..."
          value={search}
          onChange={handleSearch}
        />

        <select
          value={statusFilter}
          onChange={handleStatusFilter}
        >
          <option value="All">
            All Status
          </option>

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

      </div>


     

      {currentOrders.length === 0 ? (

        <div className="admin-orders-empty">
          <h2>No orders found</h2>

          <p>
            Try changing your search or filter.
          </p>
        </div>

      ) : (

        <div className="admin-orders-table-wrapper">

          <table className="admin-orders-table">

            <thead>
              <tr>
                <th>ORDER</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>ITEMS</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              {currentOrders.map((order) => {

                const status =
                  getOrderStatus(order);

                return (
                  <tr key={order.id}>

                    {/* ORDER */}

                    <td>
                      <strong>
                        #{order.id}
                      </strong>
                    </td>


                   

                    <td>
                      <div className="admin-order-customer">

                        <strong>
                          {getCustomerName(order)}
                        </strong>

                        <span>
                          {getCustomerEmail(order)}
                        </span>

                      </div>
                    </td>


                 

                    <td>
                      {formatDate(
                        order.createdAt ||
                          order.date ||
                          order.orderDate
                      )}
                    </td>


                   

                    <td>
                      {order.totalItems ??
                        order.items?.reduce(
                          (total, item) =>
                            total +
                            Number(
                              item.quantity || 0
                            ),
                          0
                        ) ??
                        0}
                    </td>


                    

                    <td>
                      <strong>
                        ₹
                        {getOrderTotal(
                          order
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </td>


                    

                    <td>
                      <span
                        className={`admin-order-status ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>


                   

                    <td>

                      <button
                        className="admin-view-order-btn"
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order.id}`
                          )
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}


      {/* =========================
          PAGINATION
      ========================= */}

      {totalPages > 1 && (

        <div className="admin-orders-pagination">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            Previous
          </button>


          <div className="admin-order-page-numbers">

            {Array.from(
              { length: totalPages },
              (_, index) =>
                index + 1
            ).map((page) => (

              <button
                key={page}
                className={
                  currentPage === page
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCurrentPage(page)
                }
              >
                {page}
              </button>

            ))}

          </div>


          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}

export default AdminOrders;