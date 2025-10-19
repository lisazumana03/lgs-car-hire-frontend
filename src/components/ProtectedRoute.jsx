import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false, requireRole = null }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Not authenticated - redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin is required
  if (requireAdmin && user.role !== 'ADMIN') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Admin access required.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  // Check specific role requirement
  if (requireRole) {
    // Handle both single role and array of roles
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!allowedRoles.includes(user.role)) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <p>Required role: {allowedRoles.join(' or ')}</p>
          <p>Your role: {user.role}</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;

