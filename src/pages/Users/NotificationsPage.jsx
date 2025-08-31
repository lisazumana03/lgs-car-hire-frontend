import React, { useState, useEffect } from 'react';
import { getAllNotifications } from '../../scripts/index.js';
import '../../assets/styling/Notification.css';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getAllNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      // Set mock data if API fails
      setNotifications([
        {
          notificationID: 1,
          title: "Booking on its way",
          message: "Your ride is on the way. You will receive updates shortly.",
          status: "PENDING",
          createdAt: new Date().toISOString()
        },
        {
          notificationID: 2,
          title: "Booking Completed",
          message: "Your ride has been successfully completed.",
          status: "COMPLETED",
          createdAt: new Date().toISOString()
        },
        {
          notificationID: 3,
          title: "New Booking Request",
          message: "You have a new booking request waiting for approval.",
          status: "PENDING",
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
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

  if (loading) {
    return (
      <div className="notifications-container">
        <h1>Notifications</h1>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading notifications...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>

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
                  {notification.title || 'Notification'}
                </h3>
                <p className="notification-message">
                  {notification.message || notification.description || 'No message available'}
                </p>
                <div className="notification-meta">
                  <span className="notification-time">
                    {formatDate(notification.createdAt || notification.dateCreated)}
                  </span>
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
