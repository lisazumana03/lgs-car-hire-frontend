import { useState, useEffect } from 'react';
import './UserProfile.css';

function UserProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="profile-error">
        <div className="error-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2>No User Data Available</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">
            <span className="avatar-initials">{getInitials(user.name)}</span>
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{user.name || 'Unknown User'}</h1>
            <p className="profile-email">{user.email || 'No email provided'}</p>
            <span className="profile-badge">
              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
            </span>
          </div>
        </div>
        <div className="profile-header-actions">
          <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-grid">
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">Personal Information</h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="card-content">
              <div className="info-row">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user.name || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone Number</span>
                <span className="info-value">{user.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">Identification</h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 10H6.01M10 14H18M6 14H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="card-content">
              <div className="info-row">
                <span className="info-label">ID Number</span>
                <span className="info-value">{user.idNumber || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">License Number</span>
                <span className="info-value">{user.licenseNumber || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">Account Information</h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="card-content">
              <div className="info-row">
                <span className="info-label">User ID</span>
                <span className="info-value">{user.userId || user.id || 'Not available'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role</span>
                <span className="info-value">
                  {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Status</span>
                <span className="status-badge status-active">
                  <span className="status-dot"></span>
                  Active
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since</span>
                <span className="info-value">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;