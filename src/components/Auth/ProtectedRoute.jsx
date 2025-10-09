import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

/**
 * Protected Route Component
 * Imtiyaaz Waggie 219374759
 * Redirects to login if user is not authenticated
 * Preserves the intended destination for redirect after login
 */
function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login and save the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
