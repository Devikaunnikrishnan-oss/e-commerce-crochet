import { useEffect, useMemo, useState } from "react";
import { getUsers, updateUser } from "../services/authApi";
import "./AdminUsers.css";

const ITEMS_PER_PAGE = 5;

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [customerPage, setCustomerPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers();
      setUsers(response.data);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value)
    );
  }, [users, search]);

  const customers = filteredUsers.filter(
    (user) => user.role === "user"
  );

  const admins = filteredUsers.filter(
    (user) => user.role === "admin"
  );

  const customerTotalPages = Math.ceil(
    customers.length / ITEMS_PER_PAGE
  );

  const adminTotalPages = Math.ceil(
    admins.length / ITEMS_PER_PAGE
  );

  const paginatedCustomers = customers.slice(
    (customerPage - 1) * ITEMS_PER_PAGE,
    customerPage * ITEMS_PER_PAGE
  );

  const paginatedAdmins = admins.slice(
    (adminPage - 1) * ITEMS_PER_PAGE,
    adminPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCustomerPage(1);
    setAdminPage(1);
  };

  // Block / unblock
  const handleBlockToggle = async (user) => {
    try {
      await updateUser(user.id, {
        isBlocked: !user.isBlocked
      });

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                isBlocked: !item.isBlocked
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update user status.");
    }
  };

  
  const handleActiveToggle = async (user) => {
    try {
      const newStatus = user.isActive !== false;

      await updateUser(user.id, {
        isActive: !newStatus
      });

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                isActive: !newStatus
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update account status.");
    }
  };

  const getStatus = (user) => {
    if (user.isActive === false) {
      return {
        text: "Inactive",
        className: "inactive"
      };
    }

    if (user.isBlocked) {
      return {
        text: "Blocked",
        className: "blocked"
      };
    }

    return {
      text: "Active",
      className: "active"
    };
  };

  const renderPagination = (
    currentPage,
    totalPages,
    setPage
  ) => {
    if (totalPages <= 1) return null;

    return (
      <div className="admin-pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
        >
          ← Previous
        </button>

        <span>
          Page <strong>{currentPage}</strong> of{" "}
          <strong>{totalPages}</strong>
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          Next →
        </button>
      </div>
    );
  };

  const renderTable = (data, emptyMessage) => {
    if (data.length === 0) {
      return (
        <div className="empty-users">
          <span>⌕</span>
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>USER</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {data.map((user) => {
              const status = getStatus(user);

              return (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <strong>{user.name}</strong>
                        <small>ID: {user.id}</small>
                      </div>
                    </div>
                  </td>

                  <td className="email-cell">
                    {user.email}
                  </td>

                  <td>
                    <span
                      className={`role-badge ${
                        user.role === "admin"
                          ? "admin-role"
                          : "user-role"
                      }`}
                    >
                      {user.role === "admin"
                        ? "Administrator"
                        : "Customer"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${status.className}`}
                    >
                      <span className="status-dot"></span>
                      {status.text}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className={
                          user.isBlocked
                            ? "action-btn unblock"
                            : "action-btn block"
                        }
                        onClick={() =>
                          handleBlockToggle(user)
                        }
                      >
                        {user.isBlocked
                          ? "Unblock"
                          : "Block"}
                      </button>

                      <button
                        className="action-btn deactivate"
                        onClick={() =>
                          handleActiveToggle(user)
                        }
                      >
                        {user.isActive === false
                          ? "Activate"
                          : "Deactivate"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="users-loading">
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users-page">
        <div className="users-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-users-page">

      {/* Header */}
      <div className="users-header">
        <div>
          <span className="page-eyebrow">
            USER MANAGEMENT
          </span>

          <h1>Users</h1>

          <p>
            Manage customers and administrators from one place.
          </p>
        </div>

        <div className="user-summary">
          <div>
            <strong>{customers.length}</strong>
            <span>Customers</span>
          </div>

          <div>
            <strong>{admins.length}</strong>
            <span>Admins</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="users-toolbar">
        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearch}
          />

          {search && (
            <button
              className="clear-search"
              onClick={() => {
                setSearch("");
                setCustomerPage(1);
                setAdminPage(1);
              }}
            >
              ×
            </button>
          )}
        </div>

        <span className="results-count">
          {filteredUsers.length} results
        </span>
      </div>

      {/* Customers */}
      <section className="user-section">

        <div className="section-heading">
          <div>
            <span className="section-label">
              CUSTOMER ACCOUNTS
            </span>

            <h2>Customers</h2>
          </div>

          <span className="section-count">
            {customers.length}
          </span>
        </div>

        {renderTable(
          paginatedCustomers,
          "No customers found."
        )}

        {renderPagination(
          customerPage,
          customerTotalPages,
          setCustomerPage
        )}
      </section>

      {/* Admins */}
      <section className="user-section admin-section">

        <div className="section-heading">
          <div>
            <span className="section-label">
              ADMIN ACCOUNTS
            </span>

            <h2>Administrators</h2>
          </div>

          <span className="section-count">
            {admins.length}
          </span>
        </div>

        {renderTable(
          paginatedAdmins,
          "No administrators found."
        )}

        {renderPagination(
          adminPage,
          adminTotalPages,
          setAdminPage
        )}
      </section>
    </div>
  );
}
export default AdminUsers;