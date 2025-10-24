import { useState, useEffect } from 'react';
import NotificationService from '../../services/notificationService'; // Import notification service
import '../../assets/styling/Notification.css'; // Import notification styles

export default function CreateNotification() { // Define the CreateNotification component as default export
    // State for current logged-in user
    const [currentUser, setCurrentUser] = useState(null);

    // Initialize form state with empty values
    const [formData, setFormData] = useState({
        userId: '', // Target user ID
        message: '' // Notification message
    });

    // State for form submission
    const [loading, setLoading] = useState(false); // Loading state for form submission
    const [message, setMessage] = useState(''); // Success/error message
    const [messageType, setMessageType] = useState(''); // Message type (success/error)

    // Get current user on component mount
    useEffect(() => {
        const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
            } catch (error) {
                console.error("Error parsing user from session:", error);
            }
        }
    }, []);

    // Function to handle input changes in the form
    const handleChange = (e) => {
        setFormData({
            ...formData, // Keep existing form data
            [e.target.name]: e.target.value // Update the specific field that changed
        });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true); // Set loading state to true
        setMessage(''); // Clear previous messages

        try {
            // Validate form data
            if (!formData.userId || !formData.message) {
                throw new Error('Please fill in all required fields'); // Throw error if fields are empty
            }

            // Create notification data matching backend DTO structure
            const notificationData = {
                userId: parseInt(formData.userId), // Convert userId to integer
                message: formData.message.trim() // Trim whitespace from message
            };

            // Call the notification service to create notification
            const response = await NotificationService.createNotification(notificationData);
            
            // Show success message
            setMessage('Notification sent successfully!'); // Set success message
            setMessageType('success'); // Set message type to success
            
            // Reset form after successful submission
            setFormData({
                userId: '',
                message: ''
            });

        } catch (error) {
            console.error('Error creating notification:', error); // Log error for debugging
            
            // Extract detailed error message
            let errorMessage = 'Failed to send notification. Please try again.';
            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
            } else if (error.request) {
                // Request was made but no response
                errorMessage = 'Cannot connect to server. Please check if the backend is running on port 3045.';
            } else {
                // Something else happened
                errorMessage = error.message;
            }
            
            setMessage(errorMessage); // Set error message
            setMessageType('error'); // Set message type to error
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    return (
        <>
            <div className="create-notification-container">
                {/* Page header */}
                <section className="notification-header">
                    <h1 className="notification-title">Send Notification</h1> {/* Page title */}
                    <p className="notification-subtitle">Create and send notifications to users</p> {/* Page subtitle */}
                    {currentUser && (
                        <div className="user-info-banner" style={{
                            padding: '15px',
                            backgroundColor: 'transparent',
                            borderRadius: '8px',
                            marginTop: '15px',
                            border: '1px solid #555'
                        }}>
                            <p className="user-info" style={{ margin: 0, color: 'black' }}>
                                <strong>Logged in as:</strong> {currentUser.name || currentUser.email} 
                                {currentUser.role && <span className="user-role"> ({currentUser.role})</span>}
                                <span className="user-id" style={{ color: 'black', fontWeight: 'bold' }}> | User ID: {
                                console.log("User object in message:", currentUser) ||
                                console.log("User properties:", Object.keys(currentUser)) ||
                                    (currentUser.id || currentUser.userID || currentUser.userId || currentUser.ID || 'N/A')
                                }</span>
                            </p>
                        </div>
                    )}
                </section>

                {/* Notification form */}
                <section className="notification-form-section">
                    <div className="form-container">
                        <h2 className="form-title">Create New Notification</h2> {/* Form title */}
                        
                        <form className="notification-form" onSubmit={handleSubmit} autoComplete="off">
                            {/* User ID input field */}
                            <div className="form-group">
                                <label htmlFor="userId" className="form-label">
                                    Target User ID <span className="required">*</span> {/* Required field indicator */}
                                </label>
                                <input
                                    type="number"
                                    id="userId"
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter user ID to send notification to"
                                    autoComplete="off"
                                    required
                                    min="1"
                                />
                                <small className="form-help">
                                    Enter the ID of the user who should receive this notification
                                </small>
                            </div>

                            {/* Message textarea field */}
                            <div className="form-group">
                                <label htmlFor="message" className="form-label">
                                    Notification Message <span className="required">*</span> {/* Required field indicator */}
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Enter your notification message here..."
                                    autoComplete="off"
                                    rows="5"
                                    required
                                    maxLength="500"
                                />
                                <small className="form-help">
                                    Maximum 500 characters. Be clear and concise in your message.
                                </small>
                            </div>

                            {/* Submit button */}
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? 'Sending...' : 'Send Notification'} {/* Show loading text or normal text */}
                            </button>
                        </form>

                        {/* Success/Error message display */}
                        {message && (
                            <div className={`message ${messageType}`}>
                                {message} {/* Display success or error message */}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
