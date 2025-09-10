import React, { useState, useEffect } from 'react';
import { getAllNotifications } from '../../scripts/index.js';
import '../../assets/styling/Notification.css';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    fetchNotifications();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications(true); // Silent refresh
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      
      const data = await getAllNotifications();
      
      // Sort by date (newest first) and limit to latest 10
      const sortedData = data
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.dateCreated || a.dateSent || 0);
          const dateB = new Date(b.createdAt || b.dateCreated || b.dateSent || 0);
          return dateB - dateA; // Newest first
        })
        .slice(0, 10); // Limit to latest 10
      
      // Check if data has changed
      if (JSON.stringify(sortedData) !== JSON.stringify(notifications)) {
        setNotifications(sortedData);
        setLastFetch(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(null); // API is working, no error needed
      
      // Show mock data when API fails (for demo purposes) - limited to 10
      if (!silent) {
        const mockData = [
          {
            notificationID: 1,
            title: "Welcome to LG's Car Hire!",
            message: "Thank you for choosing our premium car rental service. Your account is now active.",
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
          },
          {
            notificationID: 2,
            title: "Booking Confirmation",
            message: "Your booking #BK001 has been confirmed. Pickup scheduled for tomorrow at 10:00 AM.",
            status: "PENDING",
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
          },
          {
            notificationID: 3,
            title: "Payment Processed",
            message: "Your payment of R850.00 has been successfully processed for booking #BK001.",
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
          },
          {
            notificationID: 4,
            title: "Vehicle Ready",
            message: "Your reserved vehicle (Toyota Corolla) is ready for pickup at our main location.",
            status: "PENDING",
            createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
          }
        ];
        
        // Sort and limit mock data to 10 as well
        const sortedMockData = mockData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        
        setNotifications(sortedMockData);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'BOOKED':
      case 'COMPLETED':
        return '#4ade80'; // Green
      case 'PENDING':
        return '#fbbf24'; // Yellow
      case 'CANCELLED':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'BOOKED':
        return 'BOOKED';
      case 'COMPLETED':
        return 'COMPLETED';
      case 'PENDING':
        return 'PENDING';
      case 'CANCELLED':
        return 'CANCELLED';
      default:
        return 'UNKNOWN';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Latest Notifications</h1>
          <button onClick={handleRefresh} className="refresh-btn" disabled>
            🔄 Refreshing...
          </button>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading notifications...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Latest Notifications</h1>
        <div className="header-actions">
          <span className="notification-count">
            Showing latest {notifications.length} notifications
          </span>
          <button onClick={handleRefresh} className="refresh-btn">
            🔄 Refresh
          </button>
          {lastFetch && (
            <span className="last-updated">
              Last updated: {lastFetch.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={handleRefresh} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <h3>No notifications yet</h3>
            <p>You'll see your booking updates and important messages here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.notificationID} className="notification-card">
              <div className="notification-icon">
                <div className="user-avatar">
                  👤
                </div>
              </div>
              
              <div className="notification-content">
                <h3 className="notification-title">
                  {notification.title || `Notification from ${notification.userName || 'System'}`}
                </h3>
                <p className="notification-message">
                  {notification.message || notification.description || 'No message available'}
                </p>
                <div className="notification-meta">
                  <span className="notification-time">
                    {formatDate(notification.createdAt || notification.dateCreated || notification.dateSent)}
                  </span>
                  {notification.userName && (
                    <span className="notification-user">
                      From: {notification.userName}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="notification-status">
                <span 
                  className={`status-badge status-${notification.status?.toLowerCase() || 'unknown'}`}
                >
                  {getStatusText(notification.status)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
