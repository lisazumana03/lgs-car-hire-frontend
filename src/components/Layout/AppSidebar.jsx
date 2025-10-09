import { Link, useLocation } from 'react-router-dom';
import { APP_NAME, ROUTES } from '../../constants';
import { getUserData } from '../../services/authService';
import '../../styles/Sidebar.css';

const AppSidebar = ({ onLogout }) => {
  const location = useLocation();
  const userData = getUserData();
  const isAdmin = userData?.role?.toLowerCase() === 'admin';

  const menuItems = [
    { path: ROUTES.DASHBOARD, icon: '🏠', title: 'Dashboard' },
    { path: ROUTES.BOOKINGS, icon: '📅', title: 'Bookings' },
    { path: ROUTES.BOOKING_LIST, icon: '📋', title: 'Manage Bookings', adminOnly: true },
    { path: ROUTES.CARS, icon: '🚗', title: 'Cars' },
    { path: ROUTES.LOCATIONS, icon: '📍', title: 'Locations' },
    { path: ROUTES.REGISTER_LOCATION, icon: '📌', title: 'Add Location', adminOnly: true },
    { path: ROUTES.REGISTER_CAR, icon: '➕', title: 'Add Car', adminOnly: true },
    { path: ROUTES.PROFILE, icon: '👤', title: 'Profile' },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="sidebar">
      <h2>{APP_NAME}</h2>
      <ul className="sidebar-menu">
        {visibleMenuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="title">{item.title}</span>
            </Link>
          </li>
        ))}
        <li className="logout-item">
          <button onClick={onLogout} className="logout-btn">
            <span className="icon">🚪</span>
            <span className="title">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AppSidebar;
