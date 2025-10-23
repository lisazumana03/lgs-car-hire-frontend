import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getCurrentUserNotifications } from '../../services/notificationService';
import { getAllBookings } from '../../services/bookingService';
import { getAvailableCars } from '../../services/carService';

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeBookings: 0,
    totalRentals: 0,
    availableCars: 0,
    notifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch notifications count
      let notificationsCount = 0;
      try {
        const notifications = await getCurrentUserNotifications();
        notificationsCount = Array.isArray(notifications) ? notifications.length : 0;
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Set default value if service fails
        notificationsCount = 0;
      }

      // Fetch user's bookings
      let activeBookings = 0;
      let totalRentals = 0;
      try {
        const allBookings = await getAllBookings();
        const userBookings = Array.isArray(allBookings.data || allBookings)
            ? (allBookings.data || allBookings).filter(booking =>
                booking.userId === user?.userId ||
                booking.userID === user?.userId ||
                booking.user?.userId === user?.userId
            )
            : [];

        activeBookings = userBookings.filter(booking =>
            booking.status === 'CONFIRMED' ||
            booking.status === 'ACTIVE' ||
            booking.bookingStatus === 'CONFIRMED' ||
            booking.bookingStatus === 'ACTIVE'
        ).length;

        totalRentals = userBookings.length;
      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Set default values if service fails
        activeBookings = 0;
        totalRentals = 0;
      }

      // Fetch available cars count
      let availableCarsCount = 0;
      try {
        const availableCars = await getAvailableCars();
        availableCarsCount = Array.isArray(availableCars.data || availableCars)
            ? (availableCars.data || availableCars).length
            : 0;
      } catch (error) {
        console.error('Error fetching available cars:', error);
        // Set default value if service fails
        availableCarsCount = 0;
      }

      setStats({
        activeBookings,
        totalRentals,
        availableCars: availableCarsCount,
        notifications: notificationsCount
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'book-car':
        navigate('/select-car');
        break;
      case 'bookings':
        navigate('/bookings');
        break;
      case 'browse-cars':
        navigate('/cars');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
        <div className="dashboard-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>Loading dashboard...</h2>
          </div>
        </div>
    );
  }

  return (
      <div className="dashboard-container">
        <h1>Welcome to LG'S CAR HIRE</h1>
        <div className="welcome-message">
          <h2>Hello, {user?.firstName || 'User'}!</h2>
          <p>Welcome to your car rental dashboard. Here you can manage your bookings, view available cars, and access your account.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Active Bookings</h3>
            <span className="stat-number">{stats.activeBookings}</span>
          </div>
          <div className="stat-card">
            <h3>Total Rentals</h3>
            <span className="stat-number">{stats.totalRentals}</span>
          </div>
          <div className="stat-card">
            <h3>Available Cars</h3>
            <span className="stat-number">{stats.availableCars}</span>
          </div>
          <div className="stat-card">
            <h3>Notifications</h3>
            <span className="stat-number">{stats.notifications}</span>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button
                className="action-btn"
                onClick={() => handleQuickAction('book-car')}
            >
              Book a Car
            </button>
            <button
                className="action-btn"
                onClick={() => handleQuickAction('bookings')}
            >
              Bookings
            </button>
            <button
                className="action-btn"
                onClick={() => handleQuickAction('browse-cars')}
            >
              Browse Cars
            </button>
            <button
                className="action-btn"
                onClick={() => handleQuickAction('notifications')}
            >
              Notifications
            </button>
          </div>
        </div>
      </div>
  );
}

export default Dashboard;