import React, { useState } from 'react';
import { updateUserProfile } from '../../scripts/userApi';
import './index.css';

function UserProfile({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    idNumber: user?.idNumber || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return (
      <div className="error-container">
        <h2>No user data available</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      dateOfBirth: user.dateOfBirth || '',
      idNumber: user.idNumber || ''
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const userId = user?.id || user?.userID || user?.userId;
      
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      console.log('Updating profile for user ID:', userId);
      console.log('Form data:', formData);

      // Prepare update data matching UserDTO structure
      const updateData = {
        userId: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        idNumber: parseInt(formData.idNumber) || user.idNumber,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        role: user.role // Keep existing role
      };

      // Call backend API to update profile
      const response = await updateUserProfile(userId, updateData);
      console.log('Profile updated on backend:', response);

      // Update local user object with new data
      const updatedUser = { ...user, ...updateData };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Reload to reflect changes everywhere
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile-container">
      <h1>User Profile</h1>
      
      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="profile-details">
            <div className="profile-section">
              <h3>Personal Information</h3>
              
              <div className="profile-field">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="profile-field">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="profile-field">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="profile-field">
                <label htmlFor="phoneNumber">Phone:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="profile-field">
                <label htmlFor="dateOfBirth">Date of Birth:</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              
              <div className="profile-field">
                <label htmlFor="idNumber">ID Number:</label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button type="submit" className="edit-profile-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn" disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="profile-details">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-field">
                <label>First Name:</label>
                <span>{user.firstName || 'N/A'}</span>
              </div>
              <div className="profile-field">
                <label>Last Name:</label>
                <span>{user.lastName || 'N/A'}</span>
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
                <label>Role:</label>
                <span>{user.role || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button onClick={handleEditClick} className="edit-profile-btn">Edit Profile</button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserProfile;