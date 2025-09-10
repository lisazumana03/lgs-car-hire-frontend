import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Dashboard({ user }) {
  const navigate = useNavigate();

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

  return (
    <div className="dashboard-container">
      <h1>Welcome to LG'S CAR HIRE</h1>
      <div className="welcome-message">
        <h2>Hello, {user?.name || 'User'}!</h2>
        <p>Welcome to your car rental dashboard. Here you can manage your bookings, view available cars, and access your account.</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Bookings</h3>
          <span className="stat-number">0</span>
        </div>
        <div className="stat-card">
          <h3>Total Rentals</h3>
          <span className="stat-number">0</span>
        </div>
        <div className="stat-card">
          <h3>Available Cars</h3>
          <span className="stat-number">15</span>
        </div>
        <div className="stat-card">
          <h3>Notifications</h3>
          <span className="stat-number">2</span>
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
