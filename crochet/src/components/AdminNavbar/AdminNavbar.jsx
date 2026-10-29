import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { logoutUser } from "../../features/authSlice";

import "./AdminNavbar.css";

function AdminNavbar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      end: true
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag
    }
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`admin-sidebar ${
        collapsed ? "admin-sidebar-collapsed" : ""
      }`}
    >
      
      <div className="admin-sidebar-top">
        <div className="admin-logo">
          <h1>{collapsed ? "C" : "CROCHET"}</h1>

          {!collapsed && <span>ADMIN PANEL</span>}
        </div>

        <button
          className="admin-collapse-btn"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      
      <div className="admin-profile">
        <div className="admin-profile-icon">
          {user?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>

        {!collapsed && (
          <div className="admin-profile-info">
            <strong>{user?.name || "Admin"}</strong>
            <span>Administrator</span>
          </div>
        )}
      </div>

      
      <nav className="admin-navigation">
        {!collapsed && (
          <p className="admin-nav-label">MANAGEMENT</p>
        )}

        {menuItems.map(({ name, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            title={name}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon className="nav-icon" size={19} strokeWidth={1.8} />

            {!collapsed && <span>{name}</span>}
          </NavLink>
        ))}
      </nav>

      
      <div className="admin-sidebar-bottom">
        <button
          className="admin-logout"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut
            className="nav-icon"
            size={19}
            strokeWidth={1.8}
          />

          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default AdminNavbar;