import React, { useState, useEffect } from 'react';
import { getCurrentUserNotifications } from '../../services/notificationService';
import '../../assets/styling/Notification.css';
//The notifications page displays the latest notifications for the logged-in user.
function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from session
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user from session:", error);
      }
    }

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
      
      const data = await getCurrentUserNotifications();
      
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
      if (!silent) {
        setError('Failed to load notifications. Please try again later.');
        setNotifications([]); // Clear any existing notifications
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const  getStatusColor = (status) => {
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
            Refreshing...
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
        {currentUser && (
          <div className="user-info-banner" style={{ 
            padding: '15px', 
            backgroundColor: 'transparent', 
            borderRadius: '8px', 
            marginBottom: '15px',
            border: '1px solid #555'
          }}>
            <p className="user-info" style={{ margin: 0, color: 'white' }}>
              <strong>Logged in as:</strong> {currentUser.name || currentUser.email} 
              {currentUser.role && <span className="user-role"> ({currentUser.role})</span>}
              <span className="user-id" style={{ color: 'white', fontWeight: 'bold' }}> | User ID: {
                console.log("Current user object:", currentUser) ||
                console.log("User properties:", Object.keys(currentUser)) ||
                (currentUser.id || currentUser.userID || currentUser.userId || currentUser.ID || 'N/A')
              }</span>
            </p>
          </div>
        )}
        <div className="header-actions">
          <span className="notification-count">
            Showing latest {notifications.length} notifications
          </span>
          <button onClick={handleRefresh} className="refresh-btn">
            Refresh
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
          <button onClick={() => {
            setError(null);
            fetchNotifications();
          }} className="retry-btn">
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
