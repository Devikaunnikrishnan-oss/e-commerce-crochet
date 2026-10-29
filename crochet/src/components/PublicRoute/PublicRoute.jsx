import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  // Not logged in → allow login/register page
  if (!user) {
    return children;
  }

  // Admin → go to admin dashboard
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Normal user → go to user home
  return <Navigate to="/" replace />;
}

export default PublicRoute;