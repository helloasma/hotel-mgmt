import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PrivateRoute — wraps routes that require authentication.
 *
 * Props:
 *   children   — the component to render when authenticated
 *   adminOnly  — if true, also requires role === "admin"
 *
 * Usage in AppRoutes.jsx:
 *   <Route path="/account" element={<PrivateRoute><AccountDashboard /></PrivateRoute>} />
 *   <Route path="/admin"   element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
 */
function PrivateRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Authenticated but not admin — send to home
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
