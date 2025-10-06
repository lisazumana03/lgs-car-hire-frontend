import React, { useState, useEffect } from 'react';
import { createNotification, getAllNotifications, updateNotification, deleteNotification } from '../../scripts/notificationApi.js';
import '../../assets/styling/Notification.css';

function Message({ user }) {
  const [formData, setFormData] = useState({
    message: '',
    status: 'PENDING',
    userId: user?.id || '',
    userName: user?.name || ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [viewMode, setViewMode] = useState('create'); // 'create' or 'view'
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (viewMode === 'view') {
      fetchNotifications();
    }
  }, [viewMode]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userId: user.id || '',
        userName: user.name || ''
      }));
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setResult({ success: false, error: 'Failed to fetch notifications' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Validate required fields
    if (!formData.message.trim()) {
      setResult({ success: false, error: "Message is required" });
      setLoading(false);
      return;
    }

    if (!formData.userId) {
      setResult({ success: false, error: "User ID is required. Please make sure you are logged in." });
      setLoading(false);
      return;
    }

    if (!formData.userName) {
      setResult({ success: false, error: "User name is required. Please make sure you are logged in." });
      setLoading(false);
      return;
    }

    try {
      const notificationData = {
        message: formData.message.trim(),
        status: formData.status,
        userId: formData.userId,
        userName: formData.userName,
        dateSent: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
      };

      console.log("Form data being sent:", formData);
      console.log("Notification data being created:", notificationData);
      console.log("Current user:", user);

      let response;
      if (editingId) {
        response = await updateNotification(editingId, notificationData);
        setEditingId(null);
      } else {
        response = await createNotification(notificationData);
      }
      
      setResult({ success: true, data: response });
      setFormData({ message: '', status: 'PENDING', userId: user?.id || '', userName: user?.name || '' });
      
      // Refresh the list if in view mode
      if (viewMode === 'view') {
        fetchNotifications();
      }
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (notification) => {
    setFormData({
      message: notification.message,
      status: notification.status,
      userId: notification.userId,
      userName: notification.userName
    });
    setEditingId(notification.notificationID);
    setViewMode('create');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification(id);
        setResult({ success: true, data: { message: 'Notification deleted successfully' } });
        fetchNotifications();
      } catch (error) {
        setResult({ success: false, error: error.message });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ message: '', status: 'PENDING', userId: user?.id || '', userName: user?.name || '' });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'BOOKED':
      case 'COMPLETED':
        return '#4ade80';
      case 'PENDING':
        return '#fbbf24';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notification Management</h1>
        <div className="header-actions">
          <button 
            onClick={() => setViewMode('create')}
            className={`mode-btn ${viewMode === 'create' ? 'active' : ''}`}
          >
            Create Notification
          </button>
          <button 
            onClick={() => setViewMode('view')}
            className={`mode-btn ${viewMode === 'view' ? 'active' : ''}`}
          >
            View All Notifications
          </button>
        </div>
      </div>
      
      {viewMode === 'create' && (
        <div className="notification-form">
          <h2>{editingId ? 'Edit Notification' : 'Create New Notification'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Enter notification message..."
              />
            </div>

            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="PENDING">Pending</option>
                <option value="BOOKED">Booked</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label>User ID:</label>
              <input
                type="number"
                name="userId"
                value={formData.userId}
                readOnly
                className="readonly-field"
                title="User ID is automatically set from your login"
              />
            </div>

            <div className="form-group">
              <label>User Name:</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                readOnly
                className="readonly-field"
                title="User name is automatically set from your login"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : (editingId ? 'Update Notification' : 'Create Notification')}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-secondary"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {viewMode === 'view' && (
        <div className="notifications-list">
          <div className="list-header">
            <h2>All Notifications ({notifications.length})</h2>
            <button onClick={fetchNotifications} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <h3>No notifications found</h3>
              <p>Create your first notification using the "Create Notification" tab.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.notificationID} className="notification-card">
                <div className="notification-content">
                  <h3 className="notification-title">
                    Notification #{notification.notificationID}
                  </h3>
                  <p className="notification-message">
                    {notification.message || 'No message'}
                  </p>
                  <div className="notification-meta">
                    <span className="notification-time">
                      {formatDate(notification.dateSent)}
                    </span>
                    <span className="notification-user">
                      From: {notification.userName} (ID: {notification.userId})
                    </span>
                  </div>
                </div>
                
                <div className="notification-actions">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(notification.status) }}
                  >
                    {notification.status}
                  </span>
                  <button
                    onClick={() => handleEdit(notification)}
                    className="btn-edit"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(notification.notificationID)}
                    className="btn-delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {result && (
        <div className={`result-banner ${result.success ? 'success' : 'error'}`}>
          {result.success ? (
            <div>
              <strong>Success!</strong> {result.data.message || 'Operation completed successfully'}
            </div>
          ) : (
            <div>
              <strong>Error:</strong> {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Message;
