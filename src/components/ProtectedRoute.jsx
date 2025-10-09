import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService.js';

/**
 * Imtiyaaz Waggie 219374759
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
