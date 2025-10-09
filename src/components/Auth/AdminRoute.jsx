import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserData } from '../../services/authService';

/**
 * Admin Route Component
 * Restricts access to admin-only pages
 * Redirects to dashboard if user is not an admin
 * Redirects to login if user is not authenticated
 */
function AdminRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userData = getUserData();
  const isAdmin = userData?.role?.toLowerCase() === 'admin';

  if (!isAdmin) {
    // Redirect to dashboard if not admin
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
