
import { useEffect, useMemo, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { getUsers } from "../services/authApi";
import { getProducts } from "../services/productApi";
import { getOrders } from "../services/ordersApi";
import "./Admin.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const COLORS = {
  burgundy: "#8B1E3F",
  rose: "#A85F6E",
  gold: "#D9A441",
  green: "#6D9773",
  blue: "#64748B",
  red: "#B85C5C",
  cream: "#F7F5F1",
  text: "#4B3A40",
};

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const ORDER_COLORS = [
  COLORS.gold,
  COLORS.burgundy,
  COLORS.blue,
  COLORS.green,
  COLORS.red,
];

const PRODUCT_COLORS = [
  COLORS.burgundy,
  COLORS.gold,
  COLORS.rose,
  COLORS.green,
  COLORS.blue,
  "#9B7E46",
  "#7A5264",
];

const normalizeStatus = (status) => {
  const value = String(status || "Pending")
    .trim()
    .toLowerCase();

  if (value === "completed") return "Delivered";
  if (value === "in transit") return "Shipped";

  const matched = ORDER_STATUSES.find(
    (item) => item.toLowerCase() === value
  );

  return matched || "Pending";
};

const getOrderDate = (order) =>
  order.createdAt ||
  order.created_at ||
  order.date ||
  order.orderDate ||
  null;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const getOrderTotal = (order) =>
  Number(
    order.totalAmount ??
      order.totalPrice ??
      order.total ??
      order.amount ??
      0
  );

const getOrderCustomer = (order) =>
  order.user?.name ||
  order.customerName ||
  order.userName ||
  order.name ||
  order.user?.email ||
  order.email ||
  "Customer";

const getProductCategory = (product) =>
  product.category || product.type || "Uncategorized";

const getMonthDay = (date) =>
  date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

function StatCard({ title, value, description, symbol }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-title">{title}</span>
        <span className="stat-symbol">{symbol}</span>
      </div>

      <h2 className="stat-value">{value}</h2>

      <p className="stat-description">{description}</p>
    </div>
  );
}

function ChartMessage({ message }) {
  return (
    <div className="chart-message">
      {message}
    </div>
  );
}

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [usersResponse, productsResponse, ordersResponse] =
          await Promise.all([
            getUsers(),
            getProducts(),
            getOrders(),
          ]);

        if (!active) return;

        setUsers(
          Array.isArray(usersResponse.data)
            ? usersResponse.data
            : []
        );

        setProducts(
          Array.isArray(productsResponse.data)
            ? productsResponse.data
            : []
        );

        setOrders(
          Array.isArray(ordersResponse.data)
            ? ordersResponse.data
            : []
        );
      } catch (err) {
        if (!active) return;

        console.error("Admin dashboard loading error:", err);

        setError(
          "Unable to load dashboard data. Please check that JSON Server is running on port 3001."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  // Dashboard totals
  const totalSales = useMemo(
    () =>
      orders.reduce((sum, order) => {
        const status = normalizeStatus(order.status);

        if (status === "Cancelled") return sum;

        return sum + getOrderTotal(order);
      }, 0),
    [orders]
  );

  const pendingOrders = orders.filter(
    (order) => normalizeStatus(order.status) === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => normalizeStatus(order.status) === "Delivered"
  ).length;

  // Current order distribution
  const orderDistribution = useMemo(
    () =>
      ORDER_STATUSES.map(
        (status) =>
          orders.filter(
            (order) => normalizeStatus(order.status) === status
          ).length
      ),
    [orders]
  );

  const hasOrders = orders.length > 0;

  const doughnutData = {
    labels: ORDER_STATUSES,
    datasets: [
      {
        label: "Orders",
        data: orderDistribution,
        backgroundColor: ORDER_COLORS,
        hoverBackgroundColor: ORDER_COLORS,
        borderColor: COLORS.cream,
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 18,
          color: COLORS.text,
          font: { size: 12 },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Sales chart: last seven days
  const salesData = useMemo(() => {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      days.push(date);
    }

    const amounts = days.map((day) => {
      return orders.reduce((sum, order) => {
        const orderDate = getOrderDate(order);

        if (!orderDate) return sum;

        const parsedDate = new Date(orderDate);

        if (Number.isNaN(parsedDate.getTime())) return sum;

        const sameDay =
          parsedDate.getFullYear() === day.getFullYear() &&
          parsedDate.getMonth() === day.getMonth() &&
          parsedDate.getDate() === day.getDate();

        if (!sameDay) return sum;

        if (normalizeStatus(order.status) === "Cancelled") {
          return sum;
        }

        return sum + getOrderTotal(order);
      }, 0);
    });

    return {
      labels: days.map(getMonthDay),
      datasets: [
        {
          label: "Sales (₹)",
          data: amounts,
          borderColor: COLORS.burgundy,
          backgroundColor: "rgba(139, 30, 63, 0.14)",
          pointBackgroundColor: COLORS.gold,
          pointBorderColor: COLORS.burgundy,
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 3,
          fill: true,
          tension: 0.35,
        },
      ],
    };
  }, [orders]);

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `Sales: ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: COLORS.text },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(139, 30, 63, 0.09)",
        },
        ticks: {
          color: COLORS.text,
          callback: (value) =>
            `₹${Number(value).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  // Product category chart
  const categorySummary = useMemo(() => {
    const counts = {};

    products.forEach((product) => {
      const category = getProductCategory(product);

      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    );
  }, [products]);

  const categoryData = {
    labels: categorySummary.map(([category]) => category),
    datasets: [
      {
        label: "Products",
        data: categorySummary.map(([, count]) => count),
        backgroundColor: categorySummary.map(
          (_, index) =>
            PRODUCT_COLORS[index % PRODUCT_COLORS.length]
        ),
        borderRadius: 7,
        borderSkipped: false,
        maxBarThickness: 42,
      },
    ],
  };

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: COLORS.text,
          maxRotation: 35,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
          color: COLORS.text,
        },
        grid: {
          color: "rgba(139, 30, 63, 0.09)",
        },
      },
    },
  };

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => {
          const dateA = new Date(getOrderDate(a) || 0).getTime();
          const dateB = new Date(getOrderDate(b) || 0).getTime();

          return dateB - dateA;
        })
        .slice(0, 5),
    [orders]
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="admin-spinner" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">CROCHETSTORE / MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">
            An overview of your store's activity and performance.
          </p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={() => window.location.reload()}
          type="button"
        >
          ↻ Refresh
        </button>
      </header>

      {error && (
        <div className="admin-error" role="alert">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <section className="stats-grid">
        <StatCard
          title="Total Sales"
          value={formatCurrency(totalSales)}
          description="Non-cancelled orders"
          symbol="₹"
        />

        <StatCard
          title="Total Orders"
          value={orders.length}
          description="All recorded orders"
          symbol="▤"
        />

        <StatCard
          title="Total Products"
          value={products.length}
          description="Products in your store"
          symbol="◇"
        />

        <StatCard
          title="Total Users"
          value={users.length}
          description="Registered accounts"
          symbol="♙"
        />
      </section>

      {/* Sales chart and order distribution */}
      <section className="charts-grid">
        <article className="chart-card sales-chart">
          <div className="chart-heading">
            <div>
              <h2>Sales Overview</h2>
              <p>Daily sales over the last seven days</p>
            </div>
            <span className="chart-icon">↗</span>
          </div>

          <div className="chart-canvas">
            <Line data={salesData} options={salesOptions} />
          </div>
        </article>

        <article className="chart-card donut-chart">
          <div className="chart-heading">
            <div>
              <h2>Current Order Distribution</h2>
              <p>Orders grouped by status</p>
            </div>
            <span className="chart-icon">◉</span>
          </div>

          <div className="chart-canvas">
            {hasOrders ? (
              <Doughnut
                data={doughnutData}
                options={doughnutOptions}
                redraw
              />
            ) : (
              <ChartMessage message="No orders available yet." />
            )}
          </div>
        </article>
      </section>

      {/* Product category chart */}
      <section className="chart-card category-chart">
        <div className="chart-heading">
          <div>
            <h2>Products by Category</h2>
            <p>Number of products in each category</p>
          </div>
          <span className="chart-icon">▥</span>
        </div>

        <div className="chart-canvas">
          {categorySummary.length > 0 ? (
            <Bar data={categoryData} options={categoryOptions} />
          ) : (
            <ChartMessage message="No product categories available." />
          )}
        </div>
      </section>

      {/* Order status summary */}
      <section className="chart-card order-progress-card">
        <div className="chart-heading">
          <div>
            <h2>Order Status Summary</h2>
            <p>Track the current order workflow</p>
          </div>
        </div>

        <div className="order-progress-grid">
          {ORDER_STATUSES.map((status, index) => (
            <div className="order-progress-item" key={status}>
              <div className="progress-label">
                <span
                  className="progress-dot"
                  style={{
                    backgroundColor: ORDER_COLORS[index],
                  }}
                />
                <span>{status}</span>
              </div>

              <strong>{orderDistribution[index]}</strong>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      orders.length
                        ? (orderDistribution[index] / orders.length) * 100
                        : 0
                    }%`,
                    backgroundColor: ORDER_COLORS[index],
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary-footer">
          <span>Pending: {pendingOrders}</span>
          <span>Delivered: {deliveredOrders}</span>
        </div>
      </section>

      {/* Recent orders */}
      <section className="chart-card recent-orders">
        <div className="chart-heading">
          <div>
            <h2>Recent Orders</h2>
            <p>The five most recent orders recorded by the store</p>
          </div>
        </div>

        {recentOrders.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order, index) => {
                  const status = normalizeStatus(order.status);
                  const date = getOrderDate(order);

                  return (
                    <tr key={order.id ?? index}>
                      <td>
                        #{String(order.id ?? "N/A").slice(-8)}
                      </td>

                      <td>{getOrderCustomer(order)}</td>

                      <td>
                        {date &&
                        !Number.isNaN(new Date(date).getTime())
                          ? new Date(date).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      <td>{formatCurrency(getOrderTotal(order))}</td>

                      <td>
                        <span
                          className={`status-badge status-${status.toLowerCase()}`}
                          style={{
                            backgroundColor: `${ORDER_COLORS[ORDER_STATUSES.indexOf(status)]}20`,
                            color: ORDER_COLORS[ORDER_STATUSES.indexOf(status)],
                          }}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <ChartMessage message="No orders have been placed yet." />
        )}
      </section>
    </main>
  );
}