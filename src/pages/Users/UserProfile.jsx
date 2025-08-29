import React from 'react';
import './index.css';

function UserProfile({ user }) {
  if (!user) {
    return (
      <div className="error-container">
        <h2>No user data available</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <h1>User Profile</h1>
      <div className="profile-details">
        <div className="profile-section">
          {/* Personal Information section */}
          <h3>Personal Information</h3>
          <div className="profile-field">
            <label>Full Name:</label>
            <span>{user.name || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.email || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Phone:</label>
            <span>{user.phoneNumber || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Date of Birth:</label>
            <span>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>ID Number:</label>
            <span>{user.idNumber || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>License Number:</label>
            <span>{user.licenseNumber || 'N/A'}</span>
          </div>
        </div>
        
        <div className="profile-section">
          {/* Account Information section */}
          <h3>Account Information</h3>
          <div className="profile-field">
            <label>User ID:</label>
            <span>{user.id || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Member Since:</label>
            <span>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Status:</label>
            <span className="status-active">Active</span>
          </div>
        </div>
      </div>
      
      <div className="profile-actions">
        <button className="edit-profile-btn">Edit Profile</button>
      </div>
    </div>
  );
}

export default UserProfile;